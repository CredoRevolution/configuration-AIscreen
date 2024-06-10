<template>
  <div class="main-wrapper">
    <form class="main-wrapper__form">
      <CustomTabs
        :tabs="customTabs"
        @getDataTabs="getDataTabs"
        :dataNeeded="true"
        ref="validation1"
      />
      <template v-if="selectedTab === 'Wi-Fi'">
        <CustomInput
          :placeholderText="'Network name (SSID)'"
          :defaultErrorText="'Network name (SSID) is required'"
          v-model="form.networkName"
          @getData="getData"
          ref="validation2"
        />
        <SearchSelect
          :optionsCount="authentificationMethods"
          :search="false"
          :defaultText="'Authentification'"
          :defaultErrorText="'Authentification is required'"
          @getData="getData"
          ref="validation3"
        />
        <CustomInput
          v-if="form.Authentification == 'Basic (WPA2 Personal)'"
          :placeholderText="'Password'"
          :defaultErrorText="'Password is required'"
          :hidden="true"
          @getData="getData"
          ref="validation4"
        />
        <SearchSelect
          v-if="form.Authentification == 'Enterprise (WPA2 Enterprise)'"
          :optionsCount="security"
          :search="false"
          :defaultText="'Security'"
          :defaultErrorText="'Security is required'"
          @getData="getData"
          ref="validation5"
        />
        <template
          v-if="
            form.Security == 'TLS' &&
            form.Authentification == 'Enterprise (WPA2 Enterprise)'
          "
        >
          <CustomInput
            :placeholderText="'CA Certificates'"
            :defaultErrorText="'CA Certificates is required'"
            @getData="getData"
            :file="true"
            ref="validation6"
          />
          <CustomInput
            :placeholderText="'User Idenity'"
            :defaultErrorText="'User Idenity is required'"
            @getData="getData"
            ref="validation7"
          />
          <CustomInput
            :placeholderText="'User Private Key'"
            :defaultErrorText="'User Private Key is required'"
            @getData="getData"
            :file="true"
            ref="validation8"
          />
          <CustomInput
            :placeholderText="'User Private Key Password'"
            :defaultErrorText="'User Private Key Password is required'"
            @getData="getData"
            ref="validation9"
          />
          <CustomInput
            :placeholderText="'User Certificate'"
            :defaultErrorText="'User Certificate is required'"
            @getData="getData"
            :file="true"
            ref="validation10"
          />
        </template>
        <template
          v-if="
            form.Security == 'PEAP' &&
            form.Authentification == 'Enterprise (WPA2 Enterprise)'
          "
        >
          <CustomInput
            :placeholderText="'CA Certificates'"
            :defaultErrorText="'CA Certificates is required'"
            @getData="getData"
            :file="true"
            ref="validation11"
          />
          <CustomInput
            :placeholderText="'User Idenity'"
            :defaultErrorText="'User Idenity is required'"
            @getData="getData"
            ref="validation12"
          />
          <CustomInput
            :placeholderText="'User Password'"
            :defaultErrorText="'User Password is required'"
            :hidden="true"
            @getData="getData"
            ref="validation13"
          />
        </template>
      </template>
      <SearchSelect
        :optionsCount="timeZone"
        :search="true"
        :defaultValue="{ name: guestedTimezone }"
        :defaultText="'Time zone'"
        :defaultErrorText="'Time zone is required'"
        @getData="getData"
        ref="validation14"
      />
      <AdvancedSettings ref="advancedSettings" />
      <button type="button" class="main-btn" @click="downloadJSON">
        Generate configuration
      </button>
      <div class="preview-btn">Preview configuration</div>
    </form>
  </div>
</template>

<script>
import CustomInput from '@/components/form/CustomInput.vue'
import CustomTabs from '@/components/form/CustomTabs.vue'
import SearchSelect from '@/components/form/SearchSelect.vue'
import AdvancedSettings from '@/components/AdvancedSettings.vue'
import moment from 'moment-timezone'
export default {
  name: 'Network',
  components: { CustomInput, CustomTabs, SearchSelect, AdvancedSettings },
  data() {
    return {
      form: {
        Authentification: '',
        networkName: '',
        Security: '',
        Password: '',
      },
      selectedTab: '',
      customTabs: ['Wi-Fi', 'Ethernet'],
      authentificationMethods: [
        {
          name: 'none',
        },
        {
          name: 'Basic (WPA2 Personal)',
        },
        {
          name: 'Enterprise (WPA2 Enterprise)',
        },
      ],
      security: [
        {
          name: 'TLS',
        },
        {
          name: 'PEAP',
        },
      ],
      timeZone: [],
      guestedTimezone: '',
    }
  },
  methods: {
    downloadJSON() {
      this.checkAllValidations()
    },
    checkAllValidations() {
      this.validationCount = 0
      const validations = [
        this.$refs.validation1,
        this.$refs.validation2,
        this.$refs.validation3,
        this.$refs.validation4,
        this.$refs.validation5,
        this.$refs.validation6,
        this.$refs.validation7,
        this.$refs.validation8,
        this.$refs.validation9,
        this.$refs.validation10,
        this.$refs.validation11,
        this.$refs.validation12,
        this.$refs.validation13,
        this.$refs.validation14,
      ]
      let visibleValidations = 0
      validations.forEach((item) => {
        if (item && item.$el) {
          visibleValidations++
          item.checkValidation()
        } else {
          return
        }
        if (item.checkValidation()) {
          this.validationCount++
        }
      })
      this.$refs.advancedSettings.checkAllValidations()
      console.log(this.validationCount, 'validations of', visibleValidations)
      if (this.validationCount === visibleValidations) {
        console.log('validations passed')
        return true
      }
    },
    getData(defaultValue, selectedValue) {
      this.form[defaultValue] = selectedValue
      console.log(this.form)
    },
    getDataTabs(tab) {
      this.selectedTab = tab.textContent.trim()
      console.log(this.selectedTab)
    },
  },
  mounted() {
    this.guestedTimezone = moment.tz.guess()
    this.timeZone = moment.tz.names().map((name) => ({ name }))
  },
}
</script>

<style lang="scss">
@function rem($px) {
  @return ($px / 16px) + rem;
}

.error-message {
  color: #d42b2b;
  font-size: rem(13px);
  line-height: rem(16px);
  margin-top: rem(5px);
  position: relative;
  margin-left: rem(18px);
  display: flex;
  align-items: center;
  flex-direction: row;
  &::before {
    position: absolute;
    content: url('@/assets/img/warning.svg');
    font-size: rem(15px);
    line-height: rem(18px);
    font-weight: 500;
    position: absolute;
    width: 100%;
    height: 100%;
    left: rem(-18px);
    color: #d42b2b;
    bottom: -10%;
  }
}

.main-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: rem(735px);
  width: 100%;
  .main-wrapper__form {
    background: rgba(255, 255, 255, 1);
    border-radius: rem(30px);
    display: flex;
    padding: rem(60px);
    flex-direction: column;
    justify-content: center;
    max-width: rem(735px);
    gap: rem(17px);
    width: 100%;
    .main-btn {
      font-size: rem(19px);
      line-height: rem(23px);
      font-weight: 700;
      color: rgba(255, 255, 255, 1);
      background: rgba(0, 113, 226, 1);
      border-radius: rem(999px);
      padding: rem(14px) rem(17px) rem(15px) rem(17px);
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      width: 100%;
      border: 1px solid transparent;
      &:hover {
        opacity: 0.8;
      }
    }
    .preview-btn {
      color: rgba(134, 134, 139, 1);
      font-size: rem(19px);
      line-height: rem(29px);
      font-weight: 500;
      display: flex;
      flex-direction: row;
      gap: rem(12px);
      align-items: center;
      justify-content: center;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      &:hover {
        opacity: 0.8;
      }
      &::after {
        content: url(@/assets/img/diagonal-arrow.svg);
      }
    }
  }
}
</style>
