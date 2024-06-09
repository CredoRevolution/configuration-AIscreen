<template>
  <div class="main-wrapper">
    <CustomTabs :tabs="customTabs" @getData="getDataTabs" />
    <CustomInput
      :placeholderText="'Network name (SSID)'"
      :defaultErrorText="'Network name (SSID) is required'"
      v-model="form.networkName"
      @getData="getData"
    />
    <SearchSelect
      :optionsCount="authentificationMethods"
      :search="false"
      :defaultText="'Authentification'"
      @getData="getData"
    />
    <CustomInput
      v-if="form.Authentification == 'Basic (WPA2 Personal)'"
      :placeholderText="'Password'"
      :defaultErrorText="'Password is required'"
      :hidden="true"
      @getData="getData"
    />
    <SearchSelect
      v-if="form.Authentification == 'Enterprise (WPA2 Enterprise)'"
      :optionsCount="security"
      :search="false"
      :defaultText="'Security'"
      @getData="getData"
    />
    <template v-if="form.Security == 'TLS'">
      <CustomInput
        :placeholderText="'CA Certificates'"
        :defaultErrorText="'Password is required'"
        @getData="getData"
        :file="true"
      />
      <CustomInput
        :placeholderText="'User Idenity'"
        :defaultErrorText="'Password is required'"
        @getData="getData"
      />
      <CustomInput
        :placeholderText="'User Private Key'"
        :defaultErrorText="'Password is required'"
        @getData="getData"
        :file="true"
      />
      <CustomInput
        :placeholderText="'User Private Key Password'"
        :defaultErrorText="'Password is required'"
        @getData="getData"
      />
      <CustomInput
        :placeholderText="'User Certificate'"
        :defaultErrorText="'Password is required'"
        @getData="getData"
        :file="true"
      />
    </template>
    <template v-if="form.Security == 'PEAP'">
      <CustomInput
        :placeholderText="'CA Certificates'"
        :defaultErrorText="'Password is required'"
        @getData="getData"
        :file="true"
      />
      <CustomInput
        :placeholderText="'User Idenity'"
        :defaultErrorText="'Password is required'"
        @getData="getData"
      />
      <CustomInput
        :placeholderText="'User Password'"
        :defaultErrorText="'Password is required'"
        :hidden="true"
        @getData="getData"
      />
    </template>
    <SearchSelect
      :optionsCount="timeZone"
      :search="false"
      :defaultText="'Time zone'"
      @getData="getData"
    />
    <AdvancedSettings />
  </div>
</template>

<script>
import CustomInput from '@/components/form/CustomInput.vue'
import CustomTabs from '@/components/form/CustomTabs.vue'
import SearchSelect from '@/components/form/SearchSelect.vue'
import AdvancedSettings from '@/components/AdvancedSettings.vue'
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
      timeZone: [
        {
          name: 'UTC+1',
        },
        {
          name: 'UTC+2',
        },
      ],
    }
  },
  methods: {
    getData(defaultValue, selectedValue) {
      this.form[defaultValue] = selectedValue
      console.log(this.form)
    },
    getDataTabs(tab) {
      this.selectedTab = tab
    },
  },
}
</script>

<style lang="scss">
@function rem($px) {
  @return ($px / 16px) + rem;
}

.main-wrapper {
  background: rgba(255, 255, 255, 1);
  border-radius: rem(30px);
  display: flex;
  padding: rem(60px);
  flex-direction: column;
  justify-content: center;
  max-width: rem(735px);
  gap: rem(17px);
  width: 100%;
}
</style>
