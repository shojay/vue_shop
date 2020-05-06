export const checkEmail = (rule, val, callback) => {
  var emailReg = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/g
  if (emailReg.test(val)) {
    return callback()
  }
  return callback(new Error('Email格式不正确'))
}
export const checkMobile = (rule, val, callback) => {
  var mobileReg = /^1[3456789]\d{9}$/g
  if (mobileReg.test(val)) {
    return callback()
  }
  return callback(new Error('电话号码格式不正确'))
}
