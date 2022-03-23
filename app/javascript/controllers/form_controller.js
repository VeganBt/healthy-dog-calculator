
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
    const dogBMI = this.calcDogBMI();
    this.fetchDog(this.getDogBreed())
    .then((data) => {
      // first calculate avg dog BMI
      const healthyDogBMI = this.getBreedBMI(data);
      // then compare it with the input dog BMI
      if (dogBMI < healthyDogBMI.min) {
        console.log("Dog is underweight");
      } else if (dogBMI > healthyDogBMI.max) {
        console.log("Dog is overwight");
      } else {
        console.log("dog is healthy");
      }
    });
  }

  async fetchDog(breed) {
    const url = `https://api.thedogapi.com/v1/breeds/search?q=${breed}`
    let response = await fetch(url, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "X-Api-Key": "f60c3da9-a49e-46f9-8f9c-697e82b80e58"
      }
    })
    return await response.json();
  }

  getBreedBMI(data) {
    const minMaxWeight = data[0].weight.metric.split(' - ');
    const minMaxHeight = data[0].height.metric.split(' - ');
    const minHealthyBMI = (parseInt(minMaxWeight[0], 10) / ((parseInt(minMaxHeight[0], 10)) / 100) ** 2);
    const maxHealthyBMI = (parseInt(minMaxWeight[1], 10) / ((parseInt(minMaxHeight[1], 10)) / 100) ** 2);
    return {min: minHealthyBMI, max: maxHealthyBMI}
  }

  calcDogBMI() {
    // check if height is in cm instead of m
    let height = new FormData(this.formTarget).get('height');
    if (height > 2) { height = height / 100 }
    const weight = new FormData(this.formTarget).get('weight');
    return weight / (height ** 2)
  }
}
