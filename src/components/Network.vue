<template>
  <div class="main-wrapper">
    <form class="main-wrapper__form">
      <CustomTabs
        :tabs="customTabs"
        @getDataTabs="getDataTabs"
        :dataNeeded="true"
        ref="validation1"
      />
      <template v-if="selectedTab == 'Wi-Fi'">
        <CustomInput
          :placeholderText="'Network name (SSID)'"
          :defaultErrorText="'Network name (SSID) is required'"
          :formField="'ssid'"
          :formPlace="['network', 'wifi']"
          :inputName="'ssid'"
          @getData="getData"
          ref="validation2"
        />
        <SearchSelect
          :optionsCount="authentificationMethods"
          :search="false"
          :defaultText="'Authentification'"
          :defaultErrorText="'Authentification is required'"
          :form-place="['network', 'wifi']"
          :formField="'Authentification'"
          @getData="getData"
          ref="validation3"
        />
        <CustomInput
          v-if="form.network.wifi.Authentification === 'Basic (WPA2 Personal)'"
          :placeholderText="'Password'"
          :defaultErrorText="'Password is required'"
          :formField="'password'"
          :hidden="true"
          :formPlace="['network', 'wifi']"
          :inputName="'Password'"
          @getData="getData"
          ref="validation4"
        />
        <SearchSelect
          v-if="
            form.network.wifi.Authentification ===
            'Enterprise (WPA2 Enterprise)'
          "
          :optionsCount="security"
          :search="false"
          :defaultText="'Security'"
          :default-value="{ name: 'TLS' }"
          :defaultErrorText="'Security is required'"
          :formField="'mode'"
          :form-place="['network', 'wifi', 'enterprise']"
          @getData="getData"
          ref="validation5"
        />
        <template
          v-if="
            form.network.wifi.enterprise.mode == 'TLS' &&
            form.network.wifi.Authentification == 'Enterprise (WPA2 Enterprise)'
          "
          ref="TLS"
        >
          <CustomInput
            :placeholderText="'CA Certificates'"
            :defaultErrorText="'CA certificates is required'"
            :file="true"
            :form-field="'ca_cert'"
            :formPlace="['network', 'wifi', 'enterprise']"
            :input-name="'ca certificates'"
            @getData="getData"
            ref="validation6"
          />
          <CustomInput
            :placeholderText="'User Idenity'"
            :defaultErrorText="'User idenity is required'"
            :formField="'identity'"
            :formPlace="['network', 'wifi', 'enterprise']"
            :input-name="'user identity'"
            @getData="getData"
            ref="validation7"
          />
          <CustomInput
            :placeholderText="'User Private Key'"
            :defaultErrorText="'User private key is required'"
            :file="true"
            :formField="'private_key'"
            :formPlace="['network', 'wifi', 'enterprise']"
            :input-name="'private key'"
            @getData="getData"
            ref="validation8"
          />
          <CustomInput
            :placeholderText="'User Private Key Password'"
            :defaultErrorText="'User private key password is required'"
            :formField="'private_key_password'"
            :formPlace="['network', 'wifi', 'enterprise']"
            :input-name="'private key password'"
            @getData="getData"
            ref="validation9"
          />
          <CustomInput
            :placeholderText="'User Certificate'"
            :defaultErrorText="'User certificate is required'"
            :file="true"
            :formField="'client_cert'"
            :formPlace="['network', 'wifi', 'enterprise']"
            :input-name="'client certificate'"
            @getData="getData"
            ref="validation10"
          />
        </template>
        <template
          v-if="
            form.network.wifi.enterprise.mode == 'PEAP' &&
            form.network.wifi.Authentification == 'Enterprise (WPA2 Enterprise)'
          "
          ref="PEAP"
        >
          <CustomInput
            :placeholderText="'CA Certificates'"
            :defaultErrorText="'CA certificates is required'"
            :file="true"
            :form-field="'ca_cert'"
            :formPlace="['network', 'wifi', 'enterprise']"
            :input-name="'ca certificates'"
            @getData="getData"
            ref="validation11"
          />
          <CustomInput
            :placeholderText="'User Idenity'"
            :defaultErrorText="'User idenity is required'"
            :formField="'identity'"
            :formPlace="['network', 'wifi', 'enterprise']"
            :input-name="'user identity'"
            @getData="getData"
            ref="validation12"
          />
          <CustomInput
            :placeholderText="'User Password'"
            :defaultErrorText="'User password is required'"
            :hidden="true"
            :formField="'password'"
            :formPlace="['network', 'wifi', 'enterprise']"
            :input-name="'user password'"
            @getData="getData"
            ref="validation13"
          />
        </template>
      </template>
      <SearchSelect
        :optionsCount="timezone"
        :search="true"
        :defaultValue="{ name: guestedTimezone }"
        :defaultText="'Time zone'"
        :form-field="'timezone'"
        :defaultErrorText="'Time zone is required'"
        @getData="getData"
        ref="validation14"
      />
      <AdvancedSettings
        ref="advancedSettings"
        @sendAdvancedForm="getAdvancedForm"
      />
      <button type="button" class="main-btn" @click="downloadJSON">
        Generate configuration
      </button>
      <div class="preview-btn" @click="showPreviewConfig">
        Preview configuration
      </div>
    </form>
  </div>
</template>

<script>
import CustomInput from '@/components/form/CustomInput.vue'
import CustomTabs from '@/components/form/CustomTabs.vue'
import SearchSelect from '@/components/form/SearchSelect.vue'
import AdvancedSettings from '@/components/AdvancedSettings.vue'
import moment from 'moment-timezone'
import data from '@/assets/data.json'
export default {
  name: 'Network',
  components: { CustomInput, CustomTabs, SearchSelect, AdvancedSettings },
  data() {
    return {
      form: {
        version: '1.0.0',
        network: {
          wifi: {
            ssid: '',
            password: '',
            Authentification: '',
            enterprise: {
              mode: '',
              identity: '',
              private_key_password: '',
              ca_cert: '',
              private_key: '',
              client_cert: '',
            },
            dns: [],
            ipv4: {
              method: '',
              gateway: '',
              address: '',
            },
          },
          ethernet: {
            dns: [],
            ipv4: {
              method: '',
              gateway: '',
              address: '',
            },
          },
        },
        proxy: {
          server: {
            address: '',
            port: Number,
          },
        },
        ntp: [],
        trust_certificates: [],
      },
      selectedTab: '',
      customTabs: ['Wi-Fi', 'Ethernet'],
      authentificationMethods: [
        {
          name: 'None',
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
      timezone: [],
      guestedTimezone: '',
      readyJSON: {},
    }
  },
  methods: {
    downloadJSON() {
      if (this.checkAllValidations()) {
        const cleanedForm = this.cleanForm()
        const jsonData = JSON.stringify(cleanedForm, null, 2)
        const blob = new Blob([jsonData], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = 'player_config.json'
        link.click()
        URL.revokeObjectURL(url) // Очистка ссылки для освобождения памяти
      }
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
      if (this.$refs.advancedSettings.checkAllValidations()) {
        console.log(this.validationCount, 'validations of', visibleValidations)
        if (this.validationCount === visibleValidations) {
          console.log('validations passed')
          return true
        }
      }
    },
    getData(formPlace, formField, selectedValue) {
      if (formPlace) {
        let formObj = this.form
        for (let i = 0; i < formPlace.length; i++) {
          formObj = formObj[formPlace[i]]
        }
        formObj[formField] = selectedValue.trim()
        console.log(
          'данные записаны в форму глубже',
          formPlace + ' ' + formField
        )
        console.log(this.form)
        return
      }
      this.form[formField] = selectedValue.trim()
      console.log(this.form)
    },
    getAdvancedForm(form, selectedTab) {
      if (
        selectedTab &&
        selectedTab.trim() == 'IP Address' &&
        this.selectedTab == 'Ethernet'
      ) {
        console.log('active ip adress')
        this.form.network.ethernet.ipv4 = {
          ...form.ipv4,
        }
      }
      if (
        selectedTab &&
        selectedTab.trim() == 'IP Address' &&
        this.selectedTab == 'Wi-Fi'
      ) {
        console.log('active ip adress')
        this.form.network.wifi.ipv4 = {
          ...form.ipv4,
        }
      }
      if (
        selectedTab &&
        selectedTab.trim() == 'DNS' &&
        this.selectedTab == 'Wi-Fi'
      ) {
        this.form.network.wifi.dns = [...form.dns]
      }
      if (
        selectedTab &&
        selectedTab.trim() == 'DNS' &&
        this.selectedTab == 'Ethernet'
      ) {
        this.form.network.ethernet.dns = [...form.dns]
      }
      if (selectedTab && selectedTab.trim() == 'Proxy') {
        this.form.proxy = {
          ...form.proxy,
        }
      }
      if (selectedTab && selectedTab.trim() == 'NTP') {
        this.form.ntp = [...form.ntp]
      }
      if (selectedTab && selectedTab.trim() == 'Trusted Site’s Certificates') {
        this.form.trust_certificates = [...form.trust_certificates]
      }
    },
    getDataTabs(tab) {
      this.selectedTab = tab.textContent.trim()
      console.log(this.selectedTab)
    },
    cleanForm() {
      const cleanedForm = JSON.parse(
        JSON.stringify(this.form, (key, value) =>
          value == null ||
          value === '' ||
          (Array.isArray(value) && value.length === 0) ||
          (typeof value === 'object' &&
            value !== null &&
            Object.keys(value).length === 0)
            ? undefined
            : value
        ),
        (key, value) => {
          if (
            value === null ||
            value === '' ||
            key === 'Authentification' ||
            value === 'Option' ||
            (typeof value === 'object' && Object.keys(value).length === 0)
          ) {
            return undefined
          } else if (key === 'mode') {
            return value.toLowerCase()
          } else {
            return value
          }
        }
      )
      return cleanedForm
    },
    showPreviewConfig() {
      const cleanedForm = this.cleanForm()
      this.readyJSON = cleanedForm
      const jsonData = JSON.stringify(cleanedForm, null, 2)

      const jsonPreview = jsonData.replace(
        /("[\w]+": )("[^"]*")/g,
        (match, p1, p2) =>
          `${p1}<span style="color: #54b2bd;">${p2.replace(
            /[(][^)]*[)]/,
            ''
          )}</span>`
      )
      const jsonPreviewWithColors = jsonPreview.replace(
        /(": )({[^}]+})/g,
        (match, p1, p2) =>
          `${p1}<span style="color: #cc6666;">${p2.replace(
            /[(][^)]*[)]/,
            ''
          )}</span>`
      )
      const preview = `<style>* {margin: 0; padding: 0; height: 100vh;}</style><pre style="background-color: #1d1f21; color: #b3ff00; padding: 16px; white-space: pre-wrap;">${jsonPreviewWithColors}</pre>`
      const blob = new Blob([preview], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      window.open(url, '_blank')
      console.log(this.form)
    },
  },
  mounted() {
    this.guestedTimezone = moment.tz.guess()
    this.timezone = moment.tz.names().map((name) => ({ name }))
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
    align-items: center;
    flex-direction: row;
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
