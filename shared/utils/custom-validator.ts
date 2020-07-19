import {FormArray, FormControl, FormGroup, ValidationErrors, AbstractControl} from '@angular/forms';
import { Util } from './util';
import * as constants from '../../../assets/constants/en.json';

export class CustomValidators {

    static CHAZ = '\u4E00-\u9FCC\u3400-\u4DB5\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29';
    static JAAZ = '\u3000-\u303F\u3040-\u309F\u30A0-\u30FF\uFF00-\uFFEF\u4E00-\u9FAF\u2605-\u2606\u2190-\u2195\u203B';
    static ACCENTEDLETTERS = 'A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff';
    static SPECIALCHAR = "ÆÐƎƏƐƔĲŊŒẞÞǷȜæðǝəɛɣĳŋœĸſßþƿȝĄƁÇĐƊĘĦĮƘŁØƠŞȘŢȚŦŲƯY̨Ƴąɓçđɗęħįƙłøơşșţțŧųưy̨ƴÁÀÂÄǍĂĀÃÅǺĄÆǼǢƁĆĊĈČÇĎḌĐƊÐÉÈĖÊËĚĔĒĘẸƎƏƐĠĜǦĞĢƔáàâäǎăāãåǻąæǽǣɓćċĉčçďḍđɗðéèėêëěĕēęẹǝəɛġĝǧğģɣĤḤĦIÍÌİÎÏǏĬĪĨĮỊĲĴĶƘĹĻŁĽĿʼNŃN̈ŇÑŅŊÓÒÔÖǑŎŌÕŐỌØǾƠŒĥḥħıíìiîïǐĭīĩįịĳĵķƙĸĺļłľŀŉńn̈ňñņŋóòôöǒŏōõőọøǿơœŔŘŖŚŜŠŞȘṢẞŤŢṬŦÞÚÙÛÜǓŬŪŨŰŮŲỤƯẂẀŴẄǷÝỲŶŸȲỸƳŹŻŽẒŕřŗſśŝšşșṣßťţṭŧþúùûüǔŭūũűůųụưẃẁŵẅƿýỳŷÿȳỹƴźżžẓ";
    static numbers = '0-9';
    static letters = CustomValidators.ACCENTEDLETTERS + CustomValidators.CHAZ + CustomValidators.JAAZ + CustomValidators.SPECIALCHAR;
    static nameRegex = new RegExp('^([' + CustomValidators.letters + '\\s\\-])*$');
    static address = CustomValidators.letters + CustomValidators.numbers;
    static alphaNum = new RegExp('^([' + CustomValidators.address + '\\s\-])*$');
    static addressRegex = new RegExp('^([' + CustomValidators.address + "#,'\\s\/-])*$");
    static dobRegex = new RegExp('^([' + CustomValidators.numbers + '\\/])*$');

  static minValueNumber(minValue, maxValue, fieldName) {
    return (control: FormControl) => {
      let name = control.value;
      let message;
      const regEx = /^[0-9]*(\.\d{0,2})?/;
      minValue = Number(minValue);
      maxValue = Number(maxValue);
      if (!name) {
        message = {message: constants.errors.error10};
      } else {
        name = Number(name);
        if (!name) {
          message = {message: constants.errors.error18};
        } else if (name && !regEx.test(name)) {
          message = {message: constants.errors.error18};
        } else if (name && minValue && name < minValue) {
          message = {message: fieldName + constants.errors.error20 + minValue};
        } else if (name && maxValue && name > maxValue) {
          message = {message: fieldName + constants.errors.error21 + maxValue};
        } else {
          message = null;
        }
      }
      return message;
    };
  }

  validatePassword(minChar) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]+$/;
    const self = this;
    return (control: FormControl) => {
      const password = control.value;
      let message;
      if (!password) {
        message = {message: constants.errors.error10};
      } else if (password && password.length < minChar) {
        message = {message: constants.errors.error22};
      } else if (!regex.test(password)) {
        message = {message: constants.errors.error22};
      } else {
        message = null;
      }
      return message;
    };
  }

  validName(minChar: any, maxChar: any) {
    return (control: FormControl) => {
      const name = control.value;
      const hasCat = /_/;
      let message: any;
      if (!name) {
        message = {message: constants.errors.error10};
      } else if (name && name.length < minChar) {
        message = {message: constants.errors.error26 + minChar + constants.errors.error55};
      } else if (name && name.length > maxChar) {
        message = {message: constants.errors.error26 + maxChar + constants.errors.error55};
      } else if (!CustomValidators.nameRegex.test(name) || hasCat.test(name)) {
        message = {message: constants.errors.error28};
      } else {
        message = null;
      }
      return message;
    };
  }

  validAlphaNumeric(minChar, maxChar) {
    return (control: FormControl) => {
      const name = control.value;
      let message: any;
      const regEx = /^[a-z0-9\- ]+$/i;
      if (!name) {
        message = {message: constants.errors.error10};
      } else if (!regEx.test(name)) {
        message = {message: constants.errors.error29};
      } else if (name && name.length < minChar) {
        message = {message: constants.errors.error26 + minChar + constants.errors.error55};
      } else if (name && maxChar && name.length > maxChar) {
        message = {message: constants.errors.error30 + maxChar + constants.errors.error55};
      } else {
        message = null;
      }
      return message;
    };
  }

  reqMinMaxNum(minNum, maxChar) {
    return (control: FormControl) => {
      const value = (control.value).toString();
      let message;
      const regEx = /^[0-9]*$/;
      if (!value) {
        message = {message: constants.errors.error10};
      } else if (!regEx.test(value)) {
        message = {message: constants.errors.error18};
      } else if (value.length < minNum) {
        message = {message: constants.errors.error26 + minNum + constants.errors.error55};
      } else if (value.length > maxChar) {
        message = {message: constants.errors.error26 + maxChar + constants.errors.error55};
      } else {
        message = null;
      }
      return message;
    };
  }

  validNumbers(minChar) {
    return (control: FormControl) => {
      const name = control.value;
      let message: any;
      const regEx = /^[0-9]*$/;
      if (!name) {
        message = {message: constants.errors.error10};
      } else if (name && !regEx.test(name)) {
        message = {message: constants.errors.error18};
      } else if (name && name.length < minChar) {
        message = {message: constants.errors.error26 + minChar + constants.errors.error55};
      } else {
        message = null;
      }
      return message;
    };
  }

  minValueNumber(minValue, maxValue, fieldName) {
    return (control: FormControl) => {
      let name = control.value;
      let message: any;
      const regEx = /^[0-9]*(\.\d{0,2})?/;
      minValue = Number(minValue);
      maxValue = Number(maxValue);
      name = Number(name);
      if (!name) {
        message = {message: constants.errors.error10};
      } else if (name && !regEx.test(name)) {
        message = {message: constants.errors.error18};
      } else if (name && minValue && name < minValue) {
        message = {message: constants.errors.error20 + minValue};
      } else if (name && maxValue && name > maxValue) {
        message = {message: constants.errors.error21 + maxValue};
      } else {
        message = null;
      }
      return message;
    };
  }

  exactNumberMatch(value) {
    return (control: FormControl) => {
      const name = control.value;
      let message;
      const regEx = /^[0-9]*$/;
      value = Number(value);
      if (!name) {
        message = {message: constants.errors.error10};
      } else if (name && !regEx.test(name)) {
        message = {message: constants.errors.error18};
      } else if (name && value && name.length !== value) {
        message = {message: constants.errors.error31 + value + constants.errors.error56};
      } else {
        message = null;
      }
      return message;
    };
  }

  maxLength(value) {
    return (control: FormControl) => {
      const name = control.value;
      let message: any;
      value = Number(value);
      if (!name) {
        message = {message: constants.errors.error10};
      } else if (name && value && name.length > value) {
        message = {message: constants.errors.error32 + value + ' characters allowed'};
      } else {
        message = null;
      }
      return message;
    };
  }

  // validateUniqueness(fieldToValidate, ajaxService: AjaxService, validateUnique) {
  //   let self = this;
  //   let emailUniqueCheck = this.emailUniqueCheck;
  //   let nicknameUniqueCheck = this.nicknameUniqueCheck;
  //   return function (control: FormControl) {
  //     const name = control.value;
  //     var regEx = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  //
  //     let regEx_nickname = /^[\w&.-]+$/;
  //     let message;
  //     if (!name) {
  //       message = {'message': CustomValidators.translationService.instant('errors.error10')};
  //     } else if (name && fieldToValidate == "txtEmail" && !regEx.test(name)) {
  //       message = {'message': CustomValidators.translationService.instant('errors.error36')};
  //     } else if (name && fieldToValidate == "txtNickname" && name.length < 5 && !regEx.test(name)) {
  //       message = {'message': CustomValidators.translationService.instant('errors.error37')};
  //     } else if (validateUnique) {
  //       let validateValues = {
  //         [fieldToValidate]: name
  //       }
  //       if (fieldToValidate == "txtEmail") emailUniqueCheck++;
  //       if (fieldToValidate == "txtNickname") nicknameUniqueCheck++;
  //
  //       Promise.resolve(ajaxService.validateUniqueness(validateValues))
  //         .then(uniqueData => {
  //           if (fieldToValidate == "txtEmail" && --emailUniqueCheck == 0) {
  //             if (uniqueData && uniqueData["response"] == "1") {
  //               message = null;
  //               control.setErrors(null);
  //             } else {
  //               message = {'message': CustomValidators.translationService.instant('errors.error38')};
  //               control.setErrors(message);
  //             }
  //           } else if (fieldToValidate == "txtNickname" && --nicknameUniqueCheck == 0) {
  //             if (uniqueData && uniqueData["response"] == "1") {
  //               message = null;
  //               control.setErrors(null);
  //             } else {
  //               message = {'message': CustomValidators.translationService.instant('errors.error39')};
  //               control.setErrors(message);
  //             }
  //           }
  //
  //         });
  //
  //     }
  //
  //     return message;
  //   };
  // };

  required(c: FormControl): ValidationErrors {
    const value = c.value;
    let message;
    if (!value || value.length <= 0) {
      message = {message: constants.errors.error10};
    } else {
      message = null;
    }
    return message;
  }

  addressValidator(isOptional) {
    return (c: FormControl) => {
      const address = c.value;
      const mindigit = 2;
      const maxdigit = 200;
      let message;
      if (!address && !isOptional) {
        message = {message: constants.errors.error10};
      } else if (address && address.length < mindigit) {
        message = {message: constants.errors.error45};
      } else if (address && address.length > maxdigit) {
        message = {message: constants.errors.error46};
      } else {
        message = null;
      }
    //   else if (!CustomValidators.addressRegex.test(address)) {
    //     message = {message: constants.errors.error47};
    //   }
      return message;
    };
  }

  reqMin(minNum) {
    return (control: FormControl) => {
      const value = control.value;
      let message;
      if (!value) {
        message = {message: constants.errors.error10};
      } else if (value.length < minNum) {
        message = {message: constants.errors.error26 + minNum + constants.errors.error55};
        control.setErrors(message);
      } else {
        message = null;
      }
      return message;
    };
  }
}
