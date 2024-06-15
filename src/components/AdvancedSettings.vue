<template>
  <div class="advanced-wrapper">
    <div
      :class="['advanced-btn', active ? 'active' : '']"
      @click="showAdvanced"
      ref="advancedSettings"
    >
      Advanced
    </div>
    <div class="advanced-settings" v-if="active">
      <CustomTabs
        :tabs="CustomTabs"
        @getDataTabs="getDataTabs"
        :dataNeeded="true"
      />
      <template v-if="selectedTab === 'IP Address'">
        <SearchSelect
          :optionsCount="Options"
          :defaultText="'Option'"
          :defaultErrorText="'Option is required'"
          :form-field="'method'"
          :formPlace="['ipv4']"
          @getData="getData"
          ref="validation1"
        />
        <CustomInput
          v-if="form.ipv4.method === 'Manual (Static IP)'"
          :placeholderText="'IP Address (CIDR Format)'"
          :defaultErrorText="'IP address (CIDR format) is required'"
          :formPlace="['ipv4']"
          :input-name="'IP'"
          :form-field="'adress'"
          @getData="getData"
          ref="validation2"
        />
        <CustomInput
          v-if="form.ipv4.method === 'Manual (Static IP)'"
          :placeholderText="'Gateway'"
          :defaultErrorText="'Gateway is required'"
          :formPlace="['ipv4']"
          :form-field="'gateway'"
          :input-name="'gateway'"
          @getData="getData"
          ref="validation3"
        />
      </template>
      <template v-if="selectedTab === 'DNS'">
        <CustomInput
          v-for="(adress, index) in serverIPAdressAmount"
          :key="index"
          :placeholderText="'Server IP Address'"
          :defaultErrorText="'Server IP address is required'"
          :formPlace="['dns']"
          :form-field="`${index}`"
          :input-name="'IP'"
          @getData="getData"
          deletable
          ref="validation4"
        />
        <div class="dns-btn" @click="serverIPAdressAmount++">
          Add more
          <img :src="require('@/assets/img/add.svg')" alt="add more" />
        </div>
      </template>
      <template v-if="selectedTab === 'Proxy'">
        <div class="proxy-wrapper">
          <CustomInput
            :placeholderText="'Host'"
            :defaultErrorText="'Host is required'"
            :formPlace="['proxy', 'server']"
            :formField="'address'"
            :input-name="'host'"
            @getData="getData"
            ref="validation5"
          />
          <CustomInput
            :placeholderText="'Port'"
            :defaultErrorText="'Port is required'"
            :formPlace="['proxy', 'server']"
            :formField="'port'"
            :input-name="'port'"
            @getData="getData"
            ref="validation6"
          />
        </div>
      </template>
      <template v-if="selectedTab === 'NTP'">
        <CustomInput
          v-for="(adress, index) in NTPAmount"
          :key="index"
          :placeholderText="'NTP'"
          :defaultErrorText="'NTP is required'"
          :formPlace="['ntp']"
          :form-field="`${index}`"
          :input-name="'ntp'"
          @getData="getData"
          deletable
          ref="validation7"
        />
        <div class="dns-btn" @click="NTPAmount++">
          Add more
          <img :src="require('@/assets/img/add.svg')" alt="add more" />
        </div>
      </template>
      <template v-if="selectedTab === 'Trusted Site’s Certificates'">
        <CustomInput
          v-for="(adress, index) in SitesCertificatesAmount"
          :key="index"
          :placeholderText="'Deploy trusted site’s certificates'"
          :defaultErrorText="'Trusted site’s certificates is required'"
          :file="true"
          :formPlace="['trust_certificates']"
          :formField="`${index}`"
          :input-name="'trusted site’s certificates'"
          @getData="getData"
          deletable
          ref="validation8"
        />
        <div class="dns-btn" @click="SitesCertificatesAmount++">
          Add more
          <img :src="require('@/assets/img/add.svg')" alt="add more" />
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import CustomTabs from './form/CustomTabs.vue'
import SearchSelect from './form/SearchSelect.vue'
import CustomInput from './form/CustomInput.vue'
export default {
  name: 'AdvancedSettings',
  data() {
    return {
      active: false,
      CustomTabs: [
        'IP Address',
        'DNS',
        'Proxy',
        'NTP',
        'Trusted Site’s Certificates',
      ],
      Options: [{ name: 'Automatic DHCP' }, { name: 'Manual (Static IP)' }],
      selectedTab: '',
      form: {
        ipv4: {
          method: '',
          gateway: '',
          adress: '',
        },
        dns: [],
        proxy: {
          server: {
            address: '',
            port: '',
          },
        },
        ntp: [],
        trust_certificates: [],
      },
      serverIPAdressAmount: 1,
      NTPAmount: 1,
      SitesCertificatesAmount: 1,
    }
  },
  components: { CustomTabs, SearchSelect, CustomInput },
  methods: {
    showAdvanced() {
      if (this.$refs.advancedSettings) {
        this.active = !this.active
      }
    },
    getDataTabs(tab) {
      if (tab) {
        this.selectedTab = tab.textContent.trim()
        console.log(this.selectedTab)
      }
    },
    getData(formPlace, formField, selectedValue) {
      if (formPlace) {
        let formObj = this.form
        for (let i = 0; i < formPlace.length; i++) {
          formObj = formObj[formPlace[i]]
        }
        formObj[formField] = selectedValue.trim()
        this.$emit('sendAdvancedForm', this.form, this.selectedTab)
        return
      }
      this.form[formField] = selectedValue.trim()
      this.$emit('sendAdvancedForm', this.form, this.selectedTab)
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
      ]
      let visibleValidations = 0
      validations.forEach((item) => {
        if (Array.isArray(item)) {
          item.forEach((validation) => {
            if (validation && validation.$el) {
              visibleValidations++
              validation.checkValidation()
            } else {
              return
            }
            if (validation.checkValidation()) {
              this.validationCount++
            }
          })
        } else if (item && item.$el) {
          visibleValidations++
          item.checkValidation()
          if (item.checkValidation()) {
            this.validationCount++
          }
        }
      })
      console.log(this.validationCount, 'validations of', visibleValidations)
      if (this.validationCount === visibleValidations) {
        console.log('validations passed advanced')
        return true
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@function rem($px) {
  @return ($px / 16px) + rem;
}
.advanced-btn {
  margin: rem(17px) 0 rem(17px) 0;
  font-size: rem(28px);
  line-height: rem(33px);
  font-weight: 700;
  color: rgba(134, 134, 139, 1);
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: rem(17px);
  transition: all 0.3s ease;
  cursor: pointer;
  &:hover {
    color: rgba(20, 18, 31, 1);
    transition: all 0.3s ease;
    &::after {
      transition: all 0.3s ease;
      opacity: 1;
    }
  }
  &::after {
    content: url(@/assets/img/advanced-active.svg);
    position: relative;
    min-width: rem(17px);
    transition: all 0.3s ease;
    transform: rotateX(180deg);
    top: rem(5px);
    opacity: 0.4;
  }

  &.active {
    color: rgba(20, 18, 31, 1);
    margin-bottom: rem(34px);
    &::after {
      transform: rotateX(360deg);
      transition: all 0.3s ease;
      opacity: 1;
      top: rem(-2px);
    }
  }
}
.advanced-settings {
  display: flex;
  flex-direction: column;
  gap: rem(17px);
}
.dns-btn {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: rem(10px);
  font-size: rem(19px);
  line-height: rem(23px);
  font-weight: 700;
  color: rgba(0, 113, 226, 1);
  margin-left: rem(17px);
  cursor: pointer;
  font-family: 'satoshi', sans-serif;
  img {
    width: rem(20px);
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.proxy-wrapper {
  display: flex;
  flex-direction: row;
  gap: rem(12px);
  justify-content: space-between;
  flex-wrap: nowrap;
  align-items: center;
  .input-wrapper {
    &:nth-child(1) {
      width: 80%;
    }
  }
}
</style>
