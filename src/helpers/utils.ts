export default class Utils {
  static generate6DigitRandomNumber() {
    return Math.floor(Math.random() * 900000) + 100000;
  }
}