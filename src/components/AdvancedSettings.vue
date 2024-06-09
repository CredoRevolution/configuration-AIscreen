<template>
  <div class="advanced-wrapper">
    <div class="advanced-btn" @click="showAdvanced" ref="advancedSettings">
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
          @getData="getData"
        />
        <CustomInput
          v-if="form.Option === 'Manual (Static IP)'"
          :placeholderText="'IP Address (CIDR Format)'"
          :defaultErrorText="'IP Address (CIDR Format) is required'"
          @getData="getData"
        />
        <CustomInput
          v-if="form.Option === 'Manual (Static IP)'"
          :placeholderText="'Gateway'"
          :defaultErrorText="'Gateway is required'"
          @getData="getData"
        />
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
        Option: '',
      },
    }
  },
  components: { CustomTabs, SearchSelect, CustomInput },
  methods: {
    showAdvanced() {
      if (this.$refs.advancedSettings) {
        this.$refs.advancedSettings.classList.toggle('active')
        this.active = !this.active
      }
    },
    getDataTabs(tab) {
      if (tab) {
        this.selectedTab = tab.textContent.trim()
        console.log(this.selectedTab)
      }
    },
    getData(defaultValue, selectedValue) {
      if (defaultValue && selectedValue) {
        this.form[defaultValue] = selectedValue
        console.log(this.form)
      }
      if (defaultValue && !selectedValue) {
        this.form[defaultValue] = ''
        console.log(this.form)
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
  margin: rem(17px) 0 rem(34px) 0;
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
  &::after {
    content: url(@/assets/img/advanced.svg);
    position: relative;
    min-width: rem(17px);
    transition: all 0.3s ease;
    top: rem(-2px);
  }
  &.active {
    color: rgba(20, 18, 31, 1);
    &::after {
      transform: rotate(360deg);
      content: url(@/assets/img/advanced-active.svg);
      transition: all 0.3s ease;
    }
  }
}
.advanced-settings {
  display: flex;
  flex-direction: column;
  gap: rem(17px);
}
</style>
