<template>
  <div class="main-screen__form-item-checkbox">
    <label class="main-screen__form-item-label" for="checkbox">{{
      placeholderText
    }}</label>
    <p-check
      class="p-switch p-fill"
      @change="sendData"
      ref="customCheckbox"
    ></p-check>
  </div>
</template>

<script>
export default {
  name: 'CustomCheckbox',
  data() {
    return {
      check: false,
    }
  },
  props: {
    formField: {
      type: String,
      required: false,
    },
    formPlace: {
      type: Array,
      required: false,
    },
    placeholderText: {
      type: String,
      required: true,
    },
  },
  methods: {
    sendData() {
      this.check = !this.check
      console.log(this.check)
      this.$emit('getData', this.formPlace, this.formField, this.check)
    },
  },
}
</script>

<style lang="scss">
@function rem($px) {
  @return ($px / 16px) + rem;
}

.main-screen__form-item-checkbox {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  font-size: 29px;
  .main-screen__form-item-label {
    font-weight: 700;
    line-height: rem(29px);
    color: rgba(20, 18, 31, 1);
    font-size: rem(24px);
  }
  .pretty {
    top: 3px;
  }
  .pretty.p-switch .state:before {
    background-color: rgba(134, 134, 139, 0.16);
    border: 1px solid rgba(134, 134, 139, 0.16);
  }
  input {
    width: 200%;
  }
  .pretty.p-switch .state label:after {
    background-color: rgba(20, 18, 31, 1) !important;
  }
  .pretty.p-switch.p-fill input:checked ~ .state:before {
    background-color: rgba(0, 113, 226, 1) !important;
    border: 1px solid rgba(0, 113, 226, 1) !important;
  }
  .pretty.p-switch .state:before {
    height: calc(1em + 2px) !important;
  }
  .pretty .state label:after,
  .pretty .state label:before {
    top: -12%;
    width: calc(1em + 2px) !important;
    height: calc(1em + 2px) !important;
  }
}

@media (max-width: 768px) {
  .main-screen__form-item-checkbox {
    font-size: 24px;
    .main-screen__form-item-label {
      font-size: rem(19px);
      line-height: rem(23px);
    }
  }
}
</style>
