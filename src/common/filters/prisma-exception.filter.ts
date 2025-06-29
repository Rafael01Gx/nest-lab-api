import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response, Request } from 'express';
import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
  PrismaClientInitializationError,
} from '@prisma/client/runtime/library';

interface BaseErrorDetails {
  code?: string;
  operation?: string;
}

interface UniqueConstraintDetails extends BaseErrorDetails {
  fields: string[];
  constraint: 'unique';
}

interface ForeignKeyDetails extends BaseErrorDetails {
  field?: string;
  constraint: 'foreign_key';
}

interface RelationDetails extends BaseErrorDetails {
  relation?: string;
}

interface ValidationDetails extends BaseErrorDetails {
  field: string;
  reason: string;
  expected?: string;
}

interface ColumnDetails extends BaseErrorDetails {
  column?: string;
}

interface PathDetails extends BaseErrorDetails {
  path?: string;
}

interface FieldValueDetails extends BaseErrorDetails {
  field?: string;
  value?: unknown;
}

interface ValidationErrorDetails extends BaseErrorDetails {
  reason: string;
  message?: string;
}

interface InitializationErrorDetails extends BaseErrorDetails {
  reason: string;
  errorCode?: string;
}

type ErrorDetails =
  | UniqueConstraintDetails
  | ForeignKeyDetails
  | RelationDetails
  | ValidationDetails
  | ColumnDetails
  | PathDetails
  | FieldValueDetails
  | ValidationErrorDetails
  | InitializationErrorDetails
  | BaseErrorDetails;

interface ErrorResponse {
  statusCode: number;
  message: string;
  error: string;
  timestamp: string;
  path: string;
  details?: ErrorDetails;
}

interface HandleErrorResult {
  status: HttpStatus;
  message: string;
  error: string;
  details?: ErrorDetails;
}

// Union type para todos os tipos de erro do Prisma
type PrismaError =
  | PrismaClientKnownRequestError
  | PrismaClientUnknownRequestError
  | PrismaClientValidationError
  | PrismaClientInitializationError;

@Catch(
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
  PrismaClientInitializationError,
)
export class PrismaExceptionFilter implements ExceptionFilter<PrismaError> {
  private readonly logger = new Logger(PrismaExceptionFilter.name);

  catch(exception: PrismaError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Log do erro original para debug
    this.logger.error(`Prisma Error: ${exception.constructor.name}`, {
      error: exception.message,
      stack: exception.stack,
      meta: 'meta' in exception ? exception.meta : undefined,
      code: 'code' in exception ? exception.code : undefined,
    });

    const { status, message, error, details } =
      this.handlePrismaError(exception);

    const errorResponse: ErrorResponse = {
      statusCode: status,
      message,
      error,
      timestamp: new Date().toISOString(),
      path: request.url,
      ...(details && { details }),
    };

    response.status(status).json(errorResponse);
  }

  private handlePrismaError(exception: PrismaError): HandleErrorResult {
    if (exception instanceof PrismaClientKnownRequestError) {
      return this.handleKnownRequestError(exception);
    }

    if (exception instanceof PrismaClientUnknownRequestError) {
      return this.handleUnknownRequestError(exception);
    }

    if (exception instanceof PrismaClientValidationError) {
      return this.handleValidationError(exception);
    }

    if (exception instanceof PrismaClientInitializationError) {
      return this.handleInitializationError(exception);
    }

    // Fallback
    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Erro interno do servidor',
      error: 'Internal Server Error',
    };
  }

  private handleKnownRequestError(
    exception: PrismaClientKnownRequestError,
  ): HandleErrorResult {
    const { code, meta } = exception;

    switch (code) {
      case 'P2025':
        return {
          status: HttpStatus.NOT_FOUND,
          message: 'Registro não encontrado',
          error: 'Not Found',
          details: {
            operation: (meta?.cause as string) || 'Operação não especificada',
            code,
          },
        };

      case 'P2002': {
        const targets = (meta?.target as string[]) || [];
        return {
          status: HttpStatus.CONFLICT,
          message: `Já existe um registro com ${
            targets.length > 1 ? 'estes valores' : 'este valor'
          }`,
          error: 'Conflict',
          details: {
            fields: targets,
            constraint: 'unique',
            code,
          } as UniqueConstraintDetails,
        };
      }

      case 'P2003':
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Operação violaria integridade referencial',
          error: 'Bad Request',
          details: {
            field: meta?.field_name as string,
            constraint: 'foreign_key',
            code,
          } as ForeignKeyDetails,
        };

      case 'P2014':
        return {
          status: HttpStatus.CONFLICT,
          message:
            'Não é possível excluir este registro pois está sendo usado por outros registros',
          error: 'Conflict',
          details: {
            relation: meta?.relation_name as string,
            code,
          } as RelationDetails,
        };

      case 'P2023':
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'ID fornecido é inválido',
          error: 'Bad Request',
          details: {
            field: 'id',
            reason: 'Formato de ID inválido',
            expected: 'ID deve ter exatamente 12 ou 24 caracteres hexadecimais',
            code,
          } as ValidationDetails,
        };

      case 'P2024':
        return {
          status: HttpStatus.REQUEST_TIMEOUT,
          message: 'Operação expirou por tempo limite',
          error: 'Request Timeout',
          details: { code },
        };

      case 'P1001':
        return {
          status: HttpStatus.SERVICE_UNAVAILABLE,
          message: 'Não foi possível conectar ao banco de dados',
          error: 'Service Unavailable',
          details: { code },
        };

      case 'P1008':
        return {
          status: HttpStatus.SERVICE_UNAVAILABLE,
          message: 'Muitas conexões ativas com o banco de dados',
          error: 'Service Unavailable',
          details: { code },
        };

      case 'P2000':
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Valor muito longo para o campo',
          error: 'Bad Request',
          details: {
            column: meta?.column_name as string,
            code,
          } as ColumnDetails,
        };

      case 'P2011':
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Campo obrigatório não pode ser nulo',
          error: 'Bad Request',
          details: {
            field: (meta?.constraint as string) || 'campo não identificado',
            reason: 'Valor nulo em campo obrigatório',
            code,
          } as ValidationDetails,
        };

      case 'P2012':
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Campo obrigatório está faltando',
          error: 'Bad Request',
          details: {
            path: meta?.path as string,
            code,
          } as PathDetails,
        };

      case 'P2006':
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Valor fornecido é inválido para o campo',
          error: 'Bad Request',
          details: {
            field: meta?.field_name as string,
            value: meta?.field_value,
            code,
          } as FieldValueDetails,
        };

      default:
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Erro na operação do banco de dados',
          error: 'Bad Request',
          details: {
            code,
            operation: 'Operação não mapeada',
          },
        };
    }
  }

  private handleUnknownRequestError(
    exception: PrismaClientUnknownRequestError,
  ): HandleErrorResult {
    const isTimeoutError = exception.message.toLowerCase().includes('timeout');
    const isConnectionError = exception.message
      .toLowerCase()
      .includes('connection');

    let message = 'Erro desconhecido no banco de dados';
    let status = HttpStatus.INTERNAL_SERVER_ERROR;

    if (isTimeoutError) {
      message = 'Operação no banco de dados expirou por tempo limite';
      status = HttpStatus.REQUEST_TIMEOUT;
    } else if (isConnectionError) {
      message = 'Problema de conexão com o banco de dados';
      status = HttpStatus.SERVICE_UNAVAILABLE;
    }

    return {
      status,
      message,
      error: 'Database Error',
      details: {
        operation: 'Unknown database error',
        reason: exception.message.substring(0, 100),
      },
    };
  }

  private handleValidationError(
    exception: PrismaClientValidationError,
  ): HandleErrorResult {
    const message = exception.message;
    const isArgumentError = message.includes('Argument');
    const isMissingField = message.includes('missing');
    const isInvalidType = message.includes('Invalid value provided');

    let userMessage = 'Dados fornecidos são inválidos';
    let reason = 'Dados não passaram na validação do Prisma';

    if (isArgumentError) {
      userMessage = 'Argumentos fornecidos são inválidos';
      reason = 'Erro nos argumentos passados para a operação';
    } else if (isMissingField) {
      userMessage = 'Campos obrigatórios estão faltando';
      reason = 'Campos necessários não foram fornecidos';
    } else if (isInvalidType) {
      userMessage = 'Tipo de dados inválido fornecido';
      reason = 'Valor fornecido não é do tipo esperado';
    }

    return {
      status: HttpStatus.BAD_REQUEST,
      message: userMessage,
      error: 'Validation Error',
      details: {
        operation: 'Validation error',
        reason,
        message: message.substring(0, 200),
      } as ValidationErrorDetails,
    };
  }

  private handleInitializationError(
    exception: PrismaClientInitializationError,
  ): HandleErrorResult {
    const message = exception.message;
    const isSchemaError = message.includes('schema');
    const isConnectionError = message.includes('connect');
    const isEnvironmentError =
      message.includes('environment') || message.includes('env');

    let userMessage = 'Erro de inicialização do banco de dados';
    let reason = 'Falha na inicialização do cliente Prisma';

    if (isSchemaError) {
      userMessage = 'Erro no schema do banco de dados';
      reason = 'Problema na configuração do schema';
    } else if (isConnectionError) {
      userMessage = 'Não foi possível estabelecer conexão inicial com o banco';
      reason = 'Falha na conexão inicial';
    } else if (isEnvironmentError) {
      userMessage = 'Erro na configuração do ambiente';
      reason = 'Variáveis de ambiente mal configuradas';
    }

    return {
      status: HttpStatus.SERVICE_UNAVAILABLE,
      message: userMessage,
      error: 'Service Unavailable',
      details: {
        operation: 'Database initialization failed',
        reason,
        errorCode: exception.errorCode || 'UNKNOWN',
      } as InitializationErrorDetails,
    };
  }
}
