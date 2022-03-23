
import { Controller } from "stimulus"

export default class extends Controller {
  static targets = [ "results", "form", 'submit', 'suggestions' ]

  getDogInfo(event) {
    event.preventDefault();
    this.submitTarget.disabled = false;
    const breed = new FormData(this.formTarget).get("breed");
    if (breed.length > 2) {
      this.suggestionsTarget.innerHTML = "";
      const url = `https://api.thedogapi.com/v1/breeds/search?q=${breed}`
      console.log(url);
      fetch(url, {
        method: "GET",
        headers: {
                  "Accept": "application/json",
                  "X-Api-Key": "f60c3da9-a49e-46f9-8f9c-697e82b80e58"
                }
      })
        .then(response => response.json())
        .then((data) => {
          data.forEach((breed) => {
            this.suggestionsTarget.insertAdjacentHTML('beforeend',
            `<option value="${breed.name}">`)
          });
        });
    }
  }
}
