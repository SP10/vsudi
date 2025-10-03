class TelInput {
  constructor(element) {
    this.element = element;
    this.init();
    this.bindEvents();
  }

  init() {
    this.iti = window.intlTelInput(this.element, {
        initialCountry: 'auto',
        geoIpLookup: cb => fetch('https://ipapi.co/country/')
          .then(r => r.text()).then(code => cb(code)).catch(() => cb('UA')),
        separateDialCode: true,
        nationalMode: false, 
        autoPlaceholder: 'polite',
        preferredCountries: ['ua','pl','de'],
      });

      const id = this.element.getAttribute('id');
      this.hiddenInput = document.getElementById(`${id}_e164`);
  }

  bindEvents() {
      this.element.addEventListener('input', (event) => this.onInputHandle(event));
      this.element.addEventListener('blur', (event) => this.onInputErrorHandle(event));
      this.element.addEventListener('countrychange', (event) => this.onCountryChangeHandle(event));
  }

  onInputHandle(event) {
    this.hiddenInput.value = this.iti.getNumber();
  }

  onInputErrorHandle(event) {
    this.hiddenInput.value = this.iti.getNumber();
    this.element.classList.toggle('m-error', this.element.value && !this.iti.isValidNumber());
  }

  onCountryChangeHandle(event) {
    this.hiddenInput.value = this.iti.getNumber();
  }
}

export default TelInput;