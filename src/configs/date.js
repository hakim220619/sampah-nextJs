export default async function dateTime() {
  try {
    var today = new Date(),
      date =
        today.getFullYear() +
        '-' +
        today.getMonth() +
        1 +
        '-' +
        today.getDate() +
        ' ' +
        today.getHours() +
        ':' +
        today.getMinutes() +
        ':' +
        today.getSeconds()
    return date
  } catch (error) {
    return { error }
  }
}
