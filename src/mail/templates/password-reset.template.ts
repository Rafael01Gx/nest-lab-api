interface IPasswordResetData {
  name: string;
  email: string;
  token: string;
  url: string;
}

export function passwordResetTemplate(data: IPasswordResetData): string {
  const resetLink = `${data.url}/reset-password?email=${data.email}&token=${data.token}`;

  return `
<!DOCTYPE html>
<html lang="pt-BR">
  <body style="font-family:'Segoe UI',Roboto,Arial,sans-serif;background-color:#f5f6f8;color:#1e2939;margin:0;padding:0;">
    <div style="max-width:700px;margin:30px auto;background-color:#ffffff;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.08);overflow:hidden;border-top:6px solid #fb5920;">
      
      <div style="background-color:#1e2939;color:#ffffff;padding:20px;text-align:center;">
        <h1 style="margin:0;font-size:22px;color:#ffffff;">Recuperação de Senha - LabFísico</h1>
      </div>
      
      <div style="padding:25px;">
        <h2 style="color:#316fec;margin-top:0;">Olá, ${data.name}!</h2>
        <p style="line-height:1.6;margin-bottom:20px;">
          Você solicitou a recuperação de sua senha no sistema <strong>LabFísico</strong>.
          Clique no botão abaixo para definir uma nova senha.
        </p>

        <div style="text-align:center;margin:30px 0;">
          <a href="${resetLink}" style="background-color:#fb5920;color:#ffffff;padding:12px 25px;text-decoration:none;border-radius:6px;font-weight:600;display:inline-block;">
            Redefinir Minha Senha
          </a>
        </div>

        <p style="line-height:1.6;margin-bottom:20px;">
          Este link é válido por <strong>1 hora</strong>. Caso o botão não funcione, você pode copiar e colar o link abaixo em seu navegador:
        </p>

        <p style="word-break:break-all;color:#316fec;font-size:14px;">
          ${resetLink}
        </p>

        <p style="margin-top:25px;line-height:1.6;">
          Se você não solicitou a redefinição de senha, ignore este e-mail. Sua senha permanecerá a mesma.
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
