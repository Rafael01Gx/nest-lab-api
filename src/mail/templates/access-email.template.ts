import { SignUpDto } from 'src/modules/auth/dto/signup.dto';

export function accessEmailTemplate(user: SignUpDto): string {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
  <body style="font-family:'Segoe UI',Roboto,Arial,sans-serif;background-color:#f5f6f8;color:#1e2939;margin:0;padding:0;">
    <div style="max-width:700px;margin:30px auto;background-color:#ffffff;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.08);overflow:hidden;border-top:6px solid #fb5920;">
      
      <div style="background-color:#1e2939;color:#ffffff;padding:20px;text-align:center;">
        <h1 style="margin:0;font-size:22px;color:#ffffff;">Acesso Liberado ao Sistema LabFísico</h1>
      </div>
      
      <div style="padding:25px;">
        <h2 style="color:#316fec;margin-top:0;">Olá, ${user.name}!</h2>
        <p style="line-height:1.6;margin-bottom:20px;">
          Você foi autorizado a acessar o sistema <strong>LabFísico</strong>.
          Utilize as credenciais abaixo para realizar seu primeiro acesso.
        </p>

        <div style="background-color:#f0f2f6;border-left:4px solid #fb5920;padding:15px 20px;border-radius:8px;margin-bottom:20px;">
          <p style="margin:4px 0;line-height:1.4;"><strong>E-mail de acesso:</strong> ${user.email}</p>
          <p style="margin:4px 0;line-height:1.4;">
            <strong>Senha provisória:</strong>
            <span style="color:#fb5920;font-weight:600;">${user.password}</span>
          </p>
        </div>

        <p style="margin-top:15px;line-height:1.6;">
          ⚠️ <strong>Por segurança</strong>, altere sua senha assim que acessar o sistema.<br/>
          Vá até a aba <strong>Perfil</strong> e defina uma nova senha pessoal.
        </p>

        <p style="margin-top:25px;line-height:1.6;">
          Caso não tenha solicitado este acesso, entre em contato com o administrador do sistema.
        </p>
      </div>

      <div style="background-color:#f9fafb;padding:15px;text-align:center;font-size:13px;color:#6b7280;border-top:1px solid #e5e7eb;">
        <p style="margin:0;">Este e-mail foi enviado automaticamente pelo sistema de gestão de laboratório.</p>
        <p style="margin:4px 0 0;"><strong>© 2025 LabFísico</strong></p>
      </div>
    </div>
  </body>
</html>
  `;
}
