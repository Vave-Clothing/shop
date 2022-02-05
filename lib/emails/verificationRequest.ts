import nodemailer from "nodemailer"
import { Options } from "nodemailer/lib/smtp-connection"
import { readFileSync } from 'fs'

interface sendVerificationRequestProps {
  identifier: string
  url: string
  provider: providerProps
}

interface providerProps {
  server: string | Options
  from?: string
}

const sendVerificationRequest = async ({ identifier: email, url, provider: { server, from } }: sendVerificationRequestProps) => {
  const dkimPem = readFileSync('dkim.key', 'utf-8')

  const { host } = new URL(url)
  let transport
  if(typeof server === 'string') {
    transport = nodemailer.createTransport(server)
  } else {
    transport = nodemailer.createTransport({
      ...server,
      dkim: {
        domainName: process.env.EMAIL_DKIM_DOMAIN,
        keySelector: process.env.EMAIL_DKIM_SELECTOR,
        privateKey: dkimPem
      },
    })
  }
  await transport.sendMail({
    to: email,
    from: `Vave Clothing ${from}`,
    subject: 'Bei Vave Clothing einloggen',
    text: text({ url, host }),
    html: html({ url, host, email }),
  })
}

// Email HTML body
const html = ({ url, email }: Record<"url" | "host" | "email", string>) => {
  const escapedEmail = `${email.replace(/\./g, "&#8203;.")}`
  // const escapedHost = `${host.replace(/\./g, "&#8203;.")}`

  const backgroundColor = "#ffffff"
  const textColor = "#000000"
  const mainBackgroundColor = "#F3F4F6"
  const buttonBackgroundColor = "#6366F1"
  const buttonBorderColor = "#6366F1"
  const buttonTextColor = "#ffffff"

  return `
<body style="background: ${backgroundColor};">
  <table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center" style="padding: 10px 0px 20px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
        <strong>Vave Clothing</strong>
      </td>
    </tr>
  </table>
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background: ${mainBackgroundColor}; max-width: 600px; margin: auto; border-radius: 12px;">
    <tr>
      <td align="center" style="padding: 10px 0px 0px 0px; font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
        Als <strong><a href="#" style="text-decoration: none; color: ${textColor};">${escapedEmail}</a></strong> einloggen
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="border-radius: 8px;" bgcolor="${buttonBackgroundColor}"><a href="${url}" target="_blank" style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${buttonTextColor}; text-decoration: none; border-radius: 8px; padding: 10px 20px; border: 1px solid ${buttonBorderColor}; display: inline-block; font-weight: bold;">Einloggen</a></td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
        Wenn du diese Email nicht angefordert hast, kannst du sie ingorieren.
      </td>
    </tr>
  </table>
</body>
`
}

const text = ({ url }: Record<"url" | "host", string>) => {
  return `Bei Vave Clothing einloggen\n${url}\n\n`
}

export default sendVerificationRequest