import Long = require('long')

export class UUID {
  static encode(iTime: number, iAddition: number, iCounter: number) {
    const time = Long.fromNumber(iTime, true)
    const addition = Long.fromNumber(iAddition, true)
    const counter = Long.fromNumber(iCounter, true)

    let uuid = time.shiftLeft(20)
    uuid = uuid.or(addition.shiftLeft(10))
    uuid = uuid.or(counter)

    return uuid.toString()
  }

  static decode(id: string) {
    const long = Long.fromString(id)
    return {
      time: long.shiftRight(20).and(0x1ffffffffff).toNumber(),
      serverId: long.shiftRight(10).and(0x1fff).toNumber(),
      counter: long.shiftRight(0).and(0x3ff).toNumber(),
    }
  }

  static COUNTER = { atTime: Date.now(), value: 0, maxValue: Math.pow(2, 10) }
  static SERVER_ID = +(process.env.SERVER_ID ?? 0)

  static newId() {
    let time = Date.now()
    if (time === UUID.COUNTER.atTime) {
      UUID.COUNTER.value++
      if (UUID.COUNTER.value >= UUID.COUNTER.maxValue) {
        while (Date.now() <= time) {
          // wait next millisecond
        }
        time = Date.now()
      }
    } else {
      UUID.COUNTER.value = 0
    }
    UUID.COUNTER.atTime = time
    const counter = UUID.COUNTER.value
    return UUID.encode(time, UUID.SERVER_ID, counter)
  }
}
