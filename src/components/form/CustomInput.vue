<template>
  <div
    :class="[
      'input-wrapper',
      {
        active,
        file,
        deletable,
      },
    ]"
    ref="inputWrapper"
  >
    <label class="main-screen__form-item-label" for="text-input" ref="label">{{
      placeholderText
    }}</label>
    <input
      name="text-input"
      :type="hidden ? 'password' : 'text'"
      :class="[
        'main-screen__form-input',
        'main-screen__form-item-warnings',
        $v.name.$error ? 'error' : '',
        deletable ? 'deletable' : '',
        file ? 'file' : '',
        hidden ? 'password' : '',
      ]"
      :readonly="file"
      required
      v-model.trim="name"
      @click="
        resetValidation()
        uploadFile()
      "
      @focusin="active = true"
      @focusout="focus"
      @input="sendData"
      ref="input"
    />
    <div class="deletable" @click="deleteThisInput" v-if="deletable">
      <img :src="require('@/assets/img/cross.svg')" alt="delete" />
    </div>
    <div class="show-password" @click="showPassword" v-if="hidden">
      <img :src="require('@/assets/img/passwordEye.svg')" alt="show password" />
    </div>
    <div class="error-message" v-if="showError && !$v.name.minLength && !phone">
      Name must have at least {{ $v.name.$params.minLength.min }} letters.
    </div>
    <div class="error-message" v-if="showError && !$v.name.required && !phone">
      {{ defaultErrorText }}
    </div>
    <div class="error-message" v-if="showError && !$v.name.phoneCheck && phone">
      Please enter a valid phone number
    </div>
  </div>
</template>

<script>
import { required, minLength } from 'vuelidate/lib/validators'

export default {
  name: 'CustomInput',
  props: {
    placeholderText: {
      type: String,
      required: true,
    },
    phone: {
      type: Boolean,
      required: false,
    },
    defaultErrorText: {
      type: String,
      required: false,
    },
    hidden: {
      type: Boolean,
      required: false,
      default: false,
    },
    file: {
      type: Boolean,
      required: false,
      default: false,
    },
    deletable: {
      type: Boolean,
      required: false,
      default: false,
    },
    formField: {
      type: String,
      required: false,
    },
    formPlace: {
      type: Array,
      required: false,
    },
  },
  data() {
    return {
      name: '',
      isValid: false,
      showError: false,
      active: false,
    }
  },
  validations: {
    name: {
      phoneCheck(value) {
        if (!this.phone) {
          return true
        }
        const regex =
          /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
        return regex.test(value)
      },
      required,
      minLength: minLength(5),
    },
  },
  mounted() {
    this.resetValidation()
  },

  methods: {
    checkValidation() {
      if (this.$v) {
        this.$v.$touch()
        if (!this.$v.$invalid) {
          this.isValid = true
        } else {
          this.isValid = false
          this.showError = true
        }
      }
      return this.isValid
    },
    deleteThisInput() {
      this.$refs.inputWrapper.remove()
    },

    resetValidation() {
      this.$v.$reset()
      this.isValid = false
      this.showError = false
    },
    uploadFile() {
      if (this.file) {
        const input = document.createElement('input')
        input.type = 'file'
        input.onchange = (e) => {
          const file = e.target.files[0]
          this.name = file.name
        }
        input.click()
      }
    },
    focus() {
      console.log('called')
      if (this.name === '') {
        this.active = false
      } else {
        this.active = true
      }
    },

    showPassword() {
      console.log('1234123')
      if (this.hidden) {
        if (this.$refs.input.type === 'text') {
          this.$refs.input.type = 'password'
          return
        }
        this.$refs.input.type = 'text'
        return
      }
    },
    sendData() {
      if (this.formField) {
        this.$emit('getData', this.formPlace, this.formField, this.name)
        console.log('вернулись данные с именем поля ' + this.formField)
        return
      }
      this.$emit('getData', this.placeholderText, this.name)
    },
  },
}
</script>

<style lang="scss" scoped>
@function rem($px) {
  @return ($px / 16px) + rem;
}

.input-wrapper {
  position: relative;
  label {
    position: absolute;
    transition: all 0.3s ease;
    font-size: rem(17px);
    line-height: rem(21px);
    font-weight: 500;
    top: rem(17px);
    left: rem(15px);
    color: #86868b;
    pointer-events: none;
  }
  input[type='password'] {
    &::-ms-reveal {
      display: none;
    }
  }
  &.active {
    label {
      top: rem(6px);
      left: rem(15px);
      font-weight: 500;
      font-size: rem(13px);
      line-height: rem(17.5px);
      color: #86868b;
      transition: all 0.3s ease;
    }
  }
  &.password {
    // &::after {
    //   content: '';
    //   position: absolute;
    //   top: rem(6px);
    //   right: rem(6px);
    //   width: rem(40px);
    //   height: rem(40px);
    //   background: url('@/assets/img/arrow-down.svg');
    //   background-position: center;
    //   background-repeat: no-repeat;
    //   transition: all 0.3s ease;
    //   border-radius: rem(10px);
    //   z-index: 3;
    // }
  }
  &.file {
    cursor: pointer;
    &.deletable {
      &::after {
        right: 10.5%;
      }
    }
    &::after {
      content: '';
      position: absolute;
      top: rem(6px);
      right: rem(6px);
      width: rem(40px);
      height: rem(40px);
      background: url('@/assets/img/dots.svg');
      background-position: center;
      background-repeat: no-repeat;
      transition: all 0.3s ease;
      border-radius: rem(10px);
      z-index: 3;
    }
  }
  &.deletable {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    row-gap: 0;
  }
  .deletable {
    width: rem(52px);
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover {
      cursor: pointer;
    }
  }
  .show-password {
    position: absolute;
    top: rem(6px);
    right: rem(6px);
    width: rem(40px);
    height: rem(40px);
    background: rgba(134, 134, 139, 0.16);
    transition: all 0.3s ease;
    border-radius: rem(10px);
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover {
      cursor: pointer;
      background: rgba(134, 134, 139, 0.36);
    }
  }
  .main-screen__form-input {
    background: #fff;
    border-radius: rem(13px);
    padding: rem(23px) rem(15px) rem(8px) rem(15px);
    width: 100%;
    font-weight: 500;
    font-size: rem(17px);
    line-height: rem(21px);
    color: #14121f;
    border: 1px solid #86868b80;
    &.error {
      border: 1px solid red;
    }
    &.file {
      cursor: pointer;
    }
    &.deletable {
      width: 90.5%;
    }
    &.password {
    }
    &::placeholder {
      color: #86868b;
      font-weight: 500;
      font-size: rem(17px);
      line-height: rem(21px);
    }
    &:focus {
      border: 1px solid #0071e2 !important;
      color: #14121f;
      outline: none;
      box-shadow: 0px 0px 8px #0071e254; /* Добавьте нужный вам box-shadow стиль */
      transition: all 0.3s ease;
      &::after {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: rem(13px);
        z-index: 1;
        transition: all 0.3s;
        box-sizing: content-box;
        background: rgba(0, 113, 226, 0.25);
        backdrop-filter: blur(5px);
      }
    }
    &:active {
      border: 1px solid #0071e2 !important;
      color: #14121f;
    }
    &:focus-visible {
      border: 1px solid #0071e2 !important;
      outline: none;
    }
  }
}

// @media (max-height: 900px) {
//   .input-wrapper {
//     .main-screen__form-input {
//       padding: rem(12px);
//     }
//     .show-password {
//       width: rem(38px);
//       height: rem(38px);
//     }
//   }
// }
//
</style>
