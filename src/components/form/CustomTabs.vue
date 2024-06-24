<template>
  <div
    class="main-screen__form-switch main-screen__form-item-warnings"
    :class="{
      error: this.showError,
      widthAuto: tabs !== null && tabs !== undefined && tabs.length > 2,
    }"
    @click="resetValidation"
  >
    <div class="main-screen__form-switch-slider" ref="slider"></div>
    <div
      class="main-screen__form-switch-btn"
      @click="makeActive"
      v-for="tabs in tabs"
      :key="tabs"
      ref="tabs"
    >
      {{ tabs }}
    </div>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
export default {
  name: 'CustomTabs',
  props: {
    defaultErrorText: {
      type: String,
      required: false,
    },
    tabs: {
      type: Array,
      required: true,
    },
    dataNeeded: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      showError: false,
      alreadyActive: false,
    }
  },
  validations: {
    selected: {
      required,
    },
  },
  methods: {
    checkValidation() {
      const activeButtons = document.querySelectorAll(
        '.main-screen__form-switch-btn.active'
      )
      if (activeButtons.length > 0) {
        return true
      } else {
        this.showError = true
        return false
      }
    },
    resetValidation() {
      this.$v.$reset()
      this.showError = false
    },
    makeActive(e) {
      const slider = this.$el?.querySelector('.main-screen__form-switch-slider')
      const buttons = this.$el?.querySelectorAll(
        '.main-screen__form-switch-btn'
      )
      buttons?.forEach((button) => {
        button.classList.remove('active')
        button.classList.remove('passive')
      })
      e.target?.classList.add('active')
      let activeTab = e.target
      this.getDataTabs(activeTab)

      const sliderContainer = slider?.parentElement
      const activeButton = Array.from(buttons || []).find((button) =>
        button.classList.contains('active')
      )
      const activeButtonIndex = Array.from(buttons || []).indexOf(activeButton)
      const activeButtonOffsetTop = activeButton?.offsetTop ?? 0
      const activeButtonOffsetLeft = activeButton?.offsetLeft ?? 0
      const activeButtonHeight = activeButton?.offsetHeight ?? 0
      const activeButtonWidth = activeButton?.offsetWidth ?? 0
      const targetButtonIndex = Array.from(buttons || []).indexOf(e.target)
      const targetButtonOffsetTop = e.target?.offsetTop ?? 0
      const targetButtonOffsetLeft = e.target?.offsetLeft ?? 0
      const targetButtonHeight = e.target?.offsetHeight ?? 0
      const targetButtonWidth = e.target?.offsetWidth ?? 0

      const isToRight = targetButtonIndex > activeButtonIndex

      sliderContainer?.classList.remove('left')
      sliderContainer?.classList.remove('right')
      sliderContainer?.classList.add(isToRight ? 'right' : 'left')

      const targetTop =
        activeButtonOffsetTop +
        (targetButtonOffsetTop - activeButtonOffsetTop) *
          (targetButtonIndex - activeButtonIndex)
      const targetLeft =
        activeButtonOffsetLeft +
        (targetButtonOffsetLeft - activeButtonOffsetLeft) *
          (targetButtonIndex - activeButtonIndex)
      const targetHeight = targetButtonHeight
      const targetWidth = targetButtonWidth
      if (
        targetTop >= 0 &&
        targetTop + targetHeight <= sliderContainer.offsetHeight &&
        targetLeft >= 0 &&
        targetLeft + targetWidth <= sliderContainer.offsetWidth
      ) {
        slider.style.top = `${
          targetTop - (targetHeight - activeButtonHeight) / 2
        }px`
        slider.style.left = `${
          targetLeft - (targetWidth - activeButtonWidth) / 2
        }px`
        slider.style.height = `${targetHeight}px`
        slider.style.width = `${targetWidth}px`
      } else if (targetTop < 0) {
        slider.style.top = '0px'
        slider.style.left = `${
          activeButtonOffsetLeft +
          (targetButtonOffsetLeft - activeButtonOffsetLeft) *
            (targetButtonIndex - activeButtonIndex) -
          (targetWidth - activeButtonWidth) / 2
        }px`
        slider.style.height = `${targetButtonHeight}px`
        slider.style.width = `${targetWidth}px`
      } else if (targetLeft < 0) {
        slider.style.top = `${
          activeButtonOffsetTop +
          (targetButtonOffsetTop - activeButtonOffsetTop) *
            (targetButtonIndex - activeButtonIndex) -
          (targetHeight - activeButtonHeight) / 2
        }px`
        slider.style.left = '0px'
        slider.style.height = `${targetButtonHeight}px`
        slider.style.width = `${targetButtonWidth}px`
      } else {
        slider.style.top = `${sliderContainer.offsetHeight - targetHeight}px`
        slider.style.left = `${
          activeButtonOffsetLeft +
          (targetButtonOffsetLeft - activeButtonOffsetLeft) *
            (targetButtonIndex - activeButtonIndex) -
          (targetWidth - activeButtonWidth) / 2
        }px`
        slider.style.height = `${targetButtonHeight}px`
        slider.style.width = `${targetButtonWidth}px`
      }
    },
    getDataTabs(e) {
      if (!this.dataNeeded) {
        return
      }
      if (e) {
        this.$emit('getDataTabs', e)
      }
    },
    activateTabs() {
      this.$nextTick(() => {
        if (!this.alreadyActive) {
          this.$refs.slider.style.transition = 'none'
          this.$refs.tabs[0].click()
          this.alreadyActive = true
          setTimeout(() => {
            this.$refs.slider.style.transition = 'all 0.3s ease'
          }, 300)
        }
      })
    },
  },
  mounted() {
    this.resetValidation()
    this.$refs.tabs[0].click()
  },
}
</script>

<style lang="scss" scoped>
@function rem($px) {
  @return ($px / 16px) + rem;
}

.main-screen__form-switch {
  display: flex;
  flex-direction: row;
  padding: rem(3px);
  border: 1px solid #86868b80;
  border-radius: rem(999px);
  flex-wrap: nowrap;
  align-items: center;
  justify-content: space-evenly;
  position: relative;
  &-slider {
    position: absolute;
    background: rgba(20, 20, 20, 1);
    // border: 1px solid rgba(20, 20, 20, 1);
    border-radius: rem(999px);
    transition: all 0.3s ease;
  }
  &.error {
    border: 1px solid red;
  }
  .main-screen__form-switch-btn {
    padding: rem(12px) rem(17px);
    background: transparent;
    border-radius: rem(999px);
    font-weight: 500;
    font-size: rem(17px);
    line-height: rem(21px);
    color: #86868b;
    border: 1px solid transparent;
    transition: all 0.3s ease;
    position: relative;
    width: 100%;
    white-space: nowrap;
    text-align: center;
    cursor: pointer;
    //   &:not(:last-child):after {
    //     position: absolute;
    //     top: 15%;
    //     right: 0;
    //     height: 70%;
    //     content: '';
    //     margin-left: rem(17px);
    //     border-left: 1px solid #86868b80;
    //   }
    &.passive {
      background: #f5f5f8;
      &::after {
        content: '';
        margin-left: 0;
        border: none;
      }
    }

    &.active {
      transition: all 0.5s ease;
      border-radius: rem(999px);
      color: #fff;
      background: transparent;
      border: 1px solid transparent;
      &::after {
        content: '';
        margin-left: 0;
        border: none;
      }
      border-left: 0;
    }
  }
}
@media (max-width: 1050px) {
  .main-screen__form-switch {
    justify-content: space-between;
    flex-wrap: nowrap;
    .main-screen__form-switch-btn {
      padding: rem(12px) rem(10px);
    }
  }
}
@media (max-width: 800px) {
  .main-screen__form-switch {
    .main-screen__form-switch-btn {
      padding: rem(8px) rem(5px);
    }
  }
}

@media (max-width: 600px) {
  .main-screen__form-switch {
    // flex-wrap: wrap;
  }
  .main-screen__form-switch.widthAuto {
    flex-wrap: wrap;
    justify-content: space-around;
    border-radius: rem(30px);
    .main-screen__form-switch-slider {
      border-radius: rem(30px);
    }
    .main-screen__form-switch-btn {
      width: auto;
    }
  }
}
</style>
