import moment = require('moment')
import querystring = require('qs')
import * as crypto from 'crypto'

type BankCode =
  | ''
  | 'VNPAYQR'
  | 'NCB'
  | 'SCB'
  | 'SACOMBANK'
  | 'EXIMBANK'
  | 'MSBANK'
  | 'NAMABANK'
  | 'VISA'
  | 'VNMART'
  | 'VIETINBANK'
  | 'VIETCOMBANK'
  | 'HDBANK'
  | 'DONGABANK'
  | 'TPBANK'
  | 'OJB'
  | 'BIDV'
  | 'TECHCOMBANK'
  | 'VPBANK'
  | 'AGRIBANK'
  | 'MBBANK'
  | 'ACB'
  | 'OCB'
  | 'SHB'
  | 'IVB'

const BankName = {
  VNPAYQR: 'Ngân hàng VNPAYQR',
  NCB: 'Ngân hàng NCB',
  SCB: 'Ngân hàng SCB',
  SACOMBANK: 'Ngân hàng SACOMBANK',
  EXIMBANK: 'Ngân hàng EXIMBANK',
  MSBANK: 'Ngân hàng MSBANK',
  NAMABANK: 'Ngân hàng NAMABANK',
  VISA: 'Ngân hàng VISA',
  VNMART: 'Ngân hàng VNMART',
  VIETINBANK: 'Ngân hàng VIETINBANK',
  VIETCOMBANK: 'Ngân hàng VIETCOMBANK',
  HDBANK: 'Ngân hàng HDBANK',
  DONGABANK: 'Ngân hàng Dong A',
  TPBANK: 'Ngân hàng Tp Bank',
  OJB: 'Ngân hàng OceanBank',
  BIDV: 'Ngân hàng BIDV',
  TECHCOMBANK: 'Ngân hàng Techcombank',
  VPBANK: 'Ngân hàng VPBank',
  AGRIBANK: 'Ngân hàng AGRIBANK',
  MBBANK: 'Ngân hàng MBBank',
  ACB: 'Ngân hàng ACB',
  OCB: 'Ngân hàng OCB',
  SHB: 'Ngân hàng SHB',
  IVB: 'Ngân hàng IVB',
}

type OrderParams = {
  ipAddr: string
  amount: number
  bankCode: BankCode
  orderId: number
  orderInfo: string
  orderType: 'topup' | 'billpayment' | 'fashion'
  locale: 'vn' | 'en'
  clientHost?: string
}

export namespace VNPay {
  function getConfig() {
    return {
      vnp_TmnCode: process.env.VNP_TMNCODE,
      vnp_HashSecret: process.env.VNP_HASHSECRET,
      vnp_Url: process.env.VNP_URL,
      vnp_ReturnUrl: process.env.VNP_RETURNURL,
    }
  }

  export function createPaymentUrl(params: OrderParams) {
    const createDate = moment(new Date()).format('YYYYMMDDHHmmss')
    const { orderId, ipAddr, clientHost, amount, bankCode, orderInfo, orderType, locale } = params
    const config = getConfig()

    let vnp_Params = {}
    vnp_Params['vnp_Version'] = '2'
    vnp_Params['vnp_Command'] = 'pay'
    vnp_Params['vnp_TmnCode'] = config.vnp_TmnCode
    vnp_Params['vnp_Locale'] = locale
    vnp_Params['vnp_CurrCode'] = 'VND'
    vnp_Params['vnp_TxnRef'] = orderId
    vnp_Params['vnp_OrderInfo'] = orderInfo
    vnp_Params['vnp_OrderType'] = orderType
    vnp_Params['vnp_Amount'] = amount * 100
    vnp_Params['vnp_ReturnUrl'] = config.vnp_ReturnUrl.replace('{clientHost}', clientHost || 'http://localhost')
    vnp_Params['vnp_IpAddr'] = ipAddr
    vnp_Params['vnp_CreateDate'] = createDate
    if (bankCode !== null && bankCode !== '') {
      vnp_Params['vnp_BankCode'] = params.bankCode
    }

    vnp_Params = sortObject(vnp_Params)

    const signData = config.vnp_HashSecret + querystring.stringify(vnp_Params, { encode: false })
    const secureHash = crypto.createHash('sha256').update(signData).digest('hex')

    vnp_Params['vnp_SecureHashType'] = 'SHA256'
    vnp_Params['vnp_SecureHash'] = secureHash
    const vnpUrl = config.vnp_Url + '?' + querystring.stringify(vnp_Params, { encode: true })
    return vnpUrl
  }

  export function createPaymentUrlOrder(ip: string, order: { totalOrder: number; id: number }, clientHost?: string) {
    return createPaymentUrl({
      ipAddr: ip,
      amount: order.totalOrder,
      bankCode: '',
      orderInfo: `Thanh toan don hang #${order.id} thoi gian: ${moment(new Date()).format('YYYY-MM-DD HH:mm:ss')}`,
      locale: 'vn',
      orderType: 'billpayment',
      orderId: order.id,
      clientHost: clientHost,
    })
  }

  export function verifyResponse(queryParams) {
    let vnp_Params = queryParams
    const config = getConfig()

    const secureHash = vnp_Params['vnp_SecureHash']
    delete vnp_Params['vnp_SecureHash']
    delete vnp_Params['vnp_SecureHashType']

    vnp_Params = sortObject(vnp_Params)

    const signData = config.vnp_HashSecret + querystring.stringify(vnp_Params, { encode: false })
    const checkSum = crypto.createHash('sha256').update(signData).digest('hex')

    if (secureHash !== checkSum) return false

    const orderId = vnp_Params['vnp_TxnRef']
    const rspCode = vnp_Params['vnp_ResponseCode']

    return { orderId, rspCode }
  }

  function sortObject(o: any) {
    const sorted = {}
    const a = []

    for (const key in o) {
      if (o.hasOwnProperty(key)) {
        a.push(key)
      }
    }

    a.sort()

    for (let key = 0; key < a.length; key++) {
      sorted[a[key]] = o[a[key]]
    }
    return sorted
  }
}
