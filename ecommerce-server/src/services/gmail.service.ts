import fs = require('fs')
import path = require('path')
import util = require('util')
import { OAuth2Client } from 'google-auth-library'
import { gmail_v1, google } from 'googleapis'
import { Logger } from '../share/logger.util'

const SCOPES = [
  // 'https://www.googleapis.com/auth/gmail.readonly',
  'https://mail.google.com/',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/gmail.compose',
  'https://www.googleapis.com/auth/gmail.send',
]
const TOKEN_PATH = path.join(__dirname, '../../private/cer/token.json')
const CEDENTIALS_PATH = path.join(__dirname, '../../private/cer/google-credentials.json')
const REDIRECT_URI = 'http://' + `${process.env.HOST ?? 'localhost'}:${process.env.PORT ?? 4000}/api/system/googleauth/`

export type OAuth2Credentials = {
  web: { client_secret: string; client_id: string; redirect_uris: string[] }
}

export namespace GoogleOAuth2 {
  const TAG = 'GoogleOAuth2'
  let oAuth2Client: OAuth2Client | undefined = undefined

  export function init() {
    const credentials = GoogleOAuth2.getGoogleCedentials()
    if (!credentials) {
      Logger.info(TAG, `Loading ${path.basename(CEDENTIALS_PATH)} failed`)
      return
    }
    GoogleOAuth2.authorize(credentials)
  }

  export function getGoogleCedentials(): OAuth2Credentials | undefined {
    try {
      const content = process.env.GOOGLE_CREDENTIALS || fs.readFileSync(CEDENTIALS_PATH)
      return JSON.parse(content.toString())
    } catch (error) {
      return undefined
    }
  }

  export function authorize(credentials: OAuth2Credentials) {
    const { client_secret, client_id } = credentials.web
    oAuth2Client = new google.auth.OAuth2(client_id, client_secret, REDIRECT_URI + client_secret)
    try {
      const token = fs.readFileSync(TOKEN_PATH)
      Logger.info(TAG, `Token loaded from ${path.basename(TOKEN_PATH)}`)
      oAuth2Client.setCredentials(JSON.parse(token.toString()))
    } catch (error) {
      generateAuthUrl()
    }
  }

  export function generateAuthUrl() {
    if (!oAuth2Client) return
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    })
    Logger.info(TAG, 'Authorize this app by visiting this url:', authUrl)
    return authUrl
  }

  export async function getToken(code: string) {
    return new Promise((resolve) => {
      if (!oAuth2Client) {
        resolve(false)
        return
      }
      oAuth2Client.getToken(code, (error, token) => {
        if (error || !token || !oAuth2Client) {
          Logger.error(TAG, 'Error retrieving access token', error?.response?.data)
          resolve(false)
          return
        }
        oAuth2Client.setCredentials(token)
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err): void => {
          if (err) return Logger.error(TAG, 'Error store the token to disk')
          Logger.info(TAG, `Token stored to ${path.basename(TOKEN_PATH)}`)
        })
        resolve(true)
      })
    })
  }

  export function getOAuth2Client() {
    return oAuth2Client
  }
}

export type AttachmentFile = {
  filename: string // file name include extend
  contentType: string // Content-Type: [application/pdf, image/png]
  content?: string // content string base64
  path?: string // file path
}
export type MailData = {
  to: string
  from: string // from email address, eg: 'DISPLAY_NAME <from@gmail.com>'
  subject: string
  content?: string // html content
  files?: AttachmentFile[]
}

export namespace GmailService {
  const TAG = 'GmailService'

  function makeBody(mailData: MailData) {
    const messageParts = [
      'From: ' + mailData.from,
      'To: ' + mailData.to,
      'Subject: ' + mailData.subject,
      'MIME-Version: 1.0',
      'Content-Type: multipart/mixed; boundary="' + 'mixedB' + '"',
      '',
      '--' + 'mixedB',
      'Content-Type: multipart/related; boundary="' + 'relatedB' + '"',
      '',
      '--' + 'relatedB',
      'Content-Type: multipart/alternative; boundary="' + 'alternativeB' + '"',
      '',
      '--' + 'alternativeB',
      'Content-Type: text/html; charset=utf-8',
      '',
      !util.isNullOrUndefined(mailData.content) ? mailData.content : '',
      '',
    ]

    messageParts.push('--' + 'alternativeB' + '--', '', '--' + 'relatedB' + '--', '')

    if (mailData.files && mailData.files.length > 0) {
      mailData.files.forEach((file) => {
        if (file.content) {
          messageParts.push(
            '--' + 'mixedB',
            'Content-Type: ' + file.contentType + ';name="' + file.filename + '"',
            'Content-Transfer-Encoding: base64',
            'Content-Disposition: attachment;filename="' + file.filename + '"',
            '',
            file.content, // base64 data of the file.
            '',
          )
        }
      })
    }

    messageParts.push('--' + 'mixedB' + '--')

    const encodedMail = Buffer.from(messageParts.join('\n'))
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')
    return encodedMail
  }

  export const sendMail: ((mailData: MailData) => void) & { [prop: string]: any } = (mailData: MailData) => {
    if (!sendMail.gmail) {
      const auth = GoogleOAuth2.getOAuth2Client()
      if (!auth) return
      sendMail.gmail = google.gmail({ version: 'v1', auth })
    }
    const gmail: gmail_v1.Gmail = sendMail.gmail
    if (!gmail || !mailData) return

    if (mailData.files && mailData.files.length > 0) {
      for (let i = mailData.files.length - 1; i >= 0; i--) {
        const file = mailData.files[i]
        if (file.path) file.content = fs.readFileSync(file.path).toString('base64')
      }
    }
    gmail.users.messages.send(
      {
        userId: 'me',
        requestBody: {
          raw: makeBody(mailData),
        },
      },
      (err, res) => {
        if (err) return Logger.error(TAG, 'The API returned an error', err)
        if (!res) return Logger.error(TAG, 'Response empty')
      },
    )
  }
}
