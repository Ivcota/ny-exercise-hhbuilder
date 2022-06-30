/**
 * INIT DOM SELECTORS
 */
const head = document.querySelector("head");
const builder = document.querySelector(".builder");
const addButton = document.querySelector(".add");
const submitButton = document.querySelector(
  "body > div > form > div:nth-child(5) > button"
);
const pre = document.querySelector(".debug");
const form = document.querySelector("form");
const fields = ["age", "rel", "smoker"];
/**
 * END INIT DOM SELECTORS
 */

/**
 * CLASSES
 */
class Form {
  /**
   * @param {HouseHold} houseHold
   */
  constructor(form, fields, houseHold) {
    /**  @type {Element}  */
    this.form = form;
    /**  @type {Array}  */
    this.fields = fields;
    /**  @type {Boolean}  */
    this.isEdit = false;
    /**  @type {HouseHold}  */
    this.houseHold = houseHold;
  }

  init() {
    // UPDATE_VALIDATION_&_ACCESSIBILITY
    this.fields.forEach((field) => {
      const input = document.querySelector(`#${field}`);

      if (input.id === "age") {
        input.setAttribute("required", "");
        input.setAttribute("type", "number");
        input.setAttribute("aria-required", "");
      } else if (input.id == "rel") {
        input.setAttribute("required", "");
        input.setAttribute("aria-required", "");
      }

      input.classList.add("input");
    });

    this.fields.forEach((field, i) => {
      if (i !== 2) {
        const label = document.querySelector(`label[for="${field}"]`);
        label.childNodes[0].textContent = label.childNodes[0].textContent + "*";
      }
    });
    // END_UPDATE_VALIDATION_&_ACCESSIBILITY

    // START_FEATURES
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      const valueArray = this.createValueArray();
      this.handleAddButton(valueArray);
    });

    submitButton.addEventListener("click", async (e) => {
      e.preventDefault();
      await this.handleSubmit();
      alert("Data stored in pre");
    });

    // END_FEATURES
  }

  handleSubmit = async () => {
    this.houseHold.updateDebugNode();
  };

  handleAddButton = async ([age, rel, smoker]) => {
    if (age < 0) {
      alert("You're too young to exist. Please try again.");
      return false;
    }

    this.houseHold.addPerson({
      age,
      rel,
      isSmoker: smoker,
    });

    this.form.reset();
  };

  /** @returns {Array}  */
  createValueArray() {
    let currentFields = [];

    this.fields.forEach((field) => {
      const input = document.querySelector(`#${field}`);

      if (input.type !== "checkbox") {
        currentFields.push(input.value);
      } else {
        currentFields.push(input.checked);
      }
    });

    return currentFields;
  }
}

class Person {
  /**
     * @param {Number} age
     * @param {String} rel
     * @param {Boolean} isSmoker
  
     */
  constructor(age, rel, isSmoker) {
    this.id = JSON.stringify(Date.now());
    this.age = age;
    this.rel = rel;
    this.isSmoker = isSmoker;
  }
}

class HouseHold {
  /**
   * @param {string} id
   * @param {Element} element
   * */
  constructor(id, element) {
    this.id = id;
    /**  @type {Array.<Person>} person   */
    this.people = [];
    this.element = element;
  }
  /**  @param {Person} person   */
  addPerson({ age, rel, isSmoker }) {
    this.people.push(new Person(age, rel, isSmoker));
    console.log(this.people);
    this.updateNodes();
  }

  /**  @param {Person} person   */
  updatePerson({ id, age, rel, isSmoker }) {
    const index = this.people.findIndex((person) => person.id === id);

    const updatedPerson = new Person(age, rel, isSmoker);

    this.people[index] = {
      age: updatedPerson.age,
      isSmoker: updatedPerson.isSmoker,
      rel: updatedPerson.rel,
    };

    this.updateNodes();
  }

  /**  @param {string} id   */
  deletePerson(id) {
    const removedPersonList = this.people.filter((person) => {
      return person.id !== id;
    });

    this.people = removedPersonList;
    this.updateNodes();
  }

  updateNodes() {
    this.element.innerHTML = ``;
    this.people.forEach((person) => {
      const newEl = document.createElement("div");
      newEl.classList.add("card");

      person.isSmoker && newEl.classList.add("card--smoker");

      newEl.innerHTML = `
        <div> Relationship: ${person.rel} </div>
        <div> Age: ${person.age}</div>
        <div> Smoker: ${person.isSmoker ? "Yes" : "No"} </div>
        <button id="delete_${
          person.id
        }" class="button button--red"  >Delete</button>
        `;
      this.element.appendChild(newEl);

      const deleteButton = document.getElementById(`delete_${person.id}`);

      // instantiate an event listened to connect to the delete person class.
      deleteButton.addEventListener("click", (e) => {
        this.deletePerson(person.id);
      });
    });
  }

  updateDebugNode() {
    pre.innerHTML = JSON.stringify(this.people);
  }
}

/**
 * END CLASSES
 */

/**
 * INIT SCRIPTS
 */
function initLinkCSS() {
  const css = document.createElement("link");
  css.setAttribute("rel", "stylesheet");
  css.setAttribute("href", "./styles.css");
  head.appendChild(css);

  addButton.classList.add(["button"]);
  submitButton.classList.add("button");
  submitButton.classList.add("button--grey");
}

function initJS() {
  submitButton.setAttribute("type", "");
  const mainElement = document.createElement("main");
  builder.appendChild(mainElement);
  const houseHold = new HouseHold(JSON.stringify(Date.now()), mainElement);
  const mainForm = new Form(form, fields, houseHold);

  mainForm.init();
}

function main() {
  initLinkCSS();
  initJS();
}

main();

/**
 * END INIT SCRIPTS
 */
