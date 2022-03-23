
import { Controller } from "stimulus"

export default class extends Controller {
  static targets = [ "results", "form", 'submit', 'suggestions' ]

  getDogBreed() {
     return (new FormData(this.formTarget).get("breed"));
  }

  getDogInfo(event) {
    event.preventDefault();
    this.submitTarget.disabled = false;
    const breed = this.getDogBreed();
    if (breed.length > 2) {
      this.suggestionsTarget.innerHTML = "";
      const url = `https://api.thedogapi.com/v1/breeds/search?q=${breed}`
      fetch(url, {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "X-Api-Key": "f60c3da9-a49e-46f9-8f9c-697e82b80e58"
        }
        })
        .then(response => response.json())
        .then((data) => {
          data.forEach((breedItem) => {
            this.suggestionsTarget.insertAdjacentHTML('beforeend',
              `<option value="${breedItem.name}">`)
          })
         });
    }

  }


  showResults(event) {
    event.preventDefault();
    let height = new FormData(this.formTarget).get('height');
    // check if height is in cm instead of m
    if (height > 2) { height = height / 100 }
    const weight = new FormData(this.formTarget).get('weight');
    const dogBMI = weight / (height ** 2)
    console.log(dogBMI);
  }


}
