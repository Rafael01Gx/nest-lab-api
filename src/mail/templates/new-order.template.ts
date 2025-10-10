import { IOrdemServico } from 'src/modules/ordem-servico/interfaces/ordem-servico.interface';
import { ITipoAnalise } from 'src/modules/tipo-de-analise/interfaces/tipo-analise.interface';

export function newOrderTemplate(ordem: IOrdemServico): string {
  const amostrasHtml = ordem.amostras
    .map((a) => {
      const ensaiosSolicitados = a.ensaiosSolicitados as ITipoAnalise[];
      const ensaios = ensaiosSolicitados.map((e) => e.tipo).join(', ');
      return `
        <tr>
          <td style="border-bottom:1px solid #e5e7eb;padding:10px;font-size:14px;">${a.nomeAmostra}</td>
          <td style="border-bottom:1px solid #e5e7eb;padding:10px;font-size:14px;">${new Date(a.dataAmostra).toLocaleDateString('pt-BR')}</td>
          <td style="border-bottom:1px solid #e5e7eb;padding:10px;font-size:14px;">${ensaios}</td>
        </tr>
      `;
    })
    .join('');

  return `
<!DOCTYPE html>
<html lang="pt-BR">
  <body style="font-family:'Segoe UI',Roboto,Arial,sans-serif;background-color:#f5f6f8;color:#1e2939;margin:0;padding:0;">
    <div style="max-width:700px;margin:30px auto;background-color:#ffffff;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.08);overflow:hidden;border-top:6px solid #fb5920;">
      
      <div style="background-color:#1e2939;color:#ffffff;padding:20px;text-align:center;">
        <h1 style="margin:0;font-size:22px;color:#ffffff;">Nova Ordem de Serviço Gerada</h1>
      </div>
      
      <div style="padding:25px;">
        <h2 style="color:#316fec;margin-top:0;">Detalhes da Ordem</h2>
        <div style="background-color:#f0f2f6;border-left:4px solid #fb5920;padding:15px 20px;border-radius:8px;margin-bottom:20px;">
          <p style="margin:4px 0;line-height:1.4;"><strong>ID:</strong> ${ordem.id}</p>
          <p style="margin:4px 0;line-height:1.4;"><strong>Status:</strong> ${ordem.status}</p>
          <p style="margin:4px 0;line-height:1.4;"><strong>Observação:</strong> ${ordem.observacao || '—'}</p>
        </div>

        <h2 style="color:#316fec;">Solicitante</h2>
        <div style="background-color:#f0f2f6;border-left:4px solid #fb5920;padding:15px 20px;border-radius:8px;margin-bottom:20px;">
          <p style="margin:4px 0;line-height:1.4;"><strong>Nome:</strong> ${ordem.solicitante.name}</p>
          <p style="margin:4px 0;line-height:1.4;"><strong>E-mail:</strong> ${ordem.solicitante.email}</p>
          <p style="margin:4px 0;line-height:1.4;"><strong>Telefone:</strong> ${ordem.solicitante.phone}</p>
          <p style="margin:4px 0;line-height:1.4;"><strong>Área:</strong> ${ordem.solicitante.area}</p>
        </div>

        <h2 style="color:#316fec;">Amostras</h2>
        <div style="overflow-x:auto;">
          <table style="width:100%;border-collapse:collapse;margin-top:10px;">
            <thead>
              <tr>
                <th style="background-color:#316fec;color:#ffffff;text-align:left;padding:10px;font-size:14px;">Nome da Amostra</th>
                <th style="background-color:#316fec;color:#ffffff;text-align:left;padding:10px;font-size:14px;">Data da Amostra</th>
                <th style="background-color:#316fec;color:#ffffff;text-align:left;padding:10px;font-size:14px;">Ensaios Solicitados</th>
              </tr>
            </thead>
            <tbody>
              ${amostrasHtml}
            </tbody>
          </table>
        </div>
      </div>

      <div style="background-color:#f9fafb;padding:15px;text-align:center;font-size:13px;color:#6b7280;border-top:1px solid #e5e7eb;">
        <p style="margin:0;">Este e-mail foi enviado automaticamente pelo sistema de gestão de laboratório.</p>
        <p style="margin:4px 0 0;"><strong>© 2025 LabSystem</strong></p>
      </div>
    </div>
  </body>
</html>
`;
}
