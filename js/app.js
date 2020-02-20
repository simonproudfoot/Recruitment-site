import Vue from "vue";
import axios from 'axios'
import VueAxios from 'vue-axios'
import progressbar from './components/progressbar.vue'
Vue.use(VueAxios, axios)
const vm = new Vue({
	el: '#app',
	data: {
		dob: '',
		loading: false,
		step: 'desc',
		desc: '',
		isOpen: false,
		userFormsClean: [],
		diversityDone: '',
		userForms: [],
		got: [],
		formValue: [],
		formTitle: window.formTitle,
		hasSaved: false,
		userName: window.userName,
		userEmail: window.email,
		errors: '',
		showDiversity: true,
		showMain: false,
		showSaved: false,
		submitted: false,
		greeting: '',
		dropDown: false,
		greetings: [
			'Hola!',
			'Bonjour!',
			'Guten Tag!',
			'Ciao!',
			'Namaste!',
			'Salaam!',
			'Ni Hau!'
		]
	},
	components: {
		progressbar,
	},
	methods: {
		prev() {
			this.step--;
		},
		next() {
			this.step++;
		},
		section: function (Number) {
			this.step = Number
		},
		checkDiversity: function () {
			this.loading = true
			axios({
				method: 'get',
				url: '/!/FormSaves/CheckDiversity/' + this.userEmail,
				dataType: "json",
			}).then(response => {
				if (response.data == 1) {
					this.showMain = true;
					this.showDiversity = false;
					this.loading = false;
				} else {
					this.showMain = false;
					this.loading = false;
					this.showDiversity = true;
				}
			}).catch(errors => {
				this.error = errors
			})
		},
		saved: function () {
			this.showSaved = true
			setTimeout(() => {
				this.showSaved = false;
			}, 1000);
		},
		loaded: function () {
			this.loading = true
			setTimeout(() => {
				this.loading = false;
			}, 1000);
		},
		randomGreeting: function(){
			var getRandomWord = function () {
				return greetings[Math.floor(Math.random() * greetings.length)];
			};
			this.greeting = getRandomWord
		},
		formSubmitted(){
			this.submitted = true
			this.showMain = false
		},
		saveDiversity: function () {
			axios({
				method: 'post',
				url: '/!/FormSaves/diversity/' + this.userEmail,
				dataType: "json",
			}).then(response => {
				this.showDiversity = false;
				this.saved();
				console.log('saved');
			}).catch(errors => {
				console.log(errors);
			})
		},
		hideMainForm: function () {
			this.diversityDone = false;
		},
		unHideMainForm: function () {
			this.showMain = true;
			document.getElementById("dob").value = this.dob
		},
		convert: function getFormData($form) {
			var unindexed_array = $form.serializeArray();
			var indexed_array = {};
			$.map(unindexed_array, function (n, i) {
				indexed_array[n['name']] = n['value'];
			});
			return indexed_array;
		},
		saveForm: function (e) {
			e.preventDefault()
			var form = $("#mainform")
			this.formValue = this.convert(form)
			var current = this.formTitle
			this.$delete(this.formValue, '_token')
			this.$delete(this.formValue, '_params')
			function formExists(form) {
				return form.form === current;
			}
			if (this.userForms.find(formExists)) {
				this.userForms.find(formExists).saved = [this.formValue]
			} else {
				this.userForms.push({
					form: this.formTitle,
					id: Math.floor(1000 + Math.random() * 9000),
					saved: [this.formValue],
				})
			}
			this.hasSaved = true
			axios({
				method: 'post',
				url: '/!/FormSaves/SavedForms/' + this.userName,
				data: this.userForms,
				dataType: "json",
			}).then(response => {
				this.saved();
			}).catch(errors => {
				alert('There was an error saving this form. Please check your connection and try again');
			})
		},
		loadForms: function () {
			this.loading = true;
			axios.get("/!/FormSaves/Forms/" + this.userName).then((response) => {
				this.userForms = response.data;
				var a = JSON.parse(JSON.stringify(response.data.find(form => form.form === this.formTitle)))
				var result = a['saved'][0];
				this.receivedSaved = result
				this.loading = false;
				if (result) {
					this.hasSaved = true
					this.formValue = a['saved'][0];
				} else {
					this.hasSaved = false
				}
			}, (error) => {
				this.loading = false;
			})
		},
		getForm: function () {
			$('input[type=checkbox]').prop("checked", false);
			this.loaded();
			var frm = $("#mainform");
			var i;
			for (i in this.formValue) {
				var fields = frm.find('[name="' + i + '"]');
				var checkboxes = document.getElementsByName(i)
				if (fields.attr('type') == 'checkbox' || fields.attr('type') == 'radio') {
					for (var c = 0; c < checkboxes.length; c++) {
						if (checkboxes[c].value == this.formValue[i]) {
							checkboxes[c].click();
						}
					}
				} else {
					fields.val(this.formValue[i]);
				}
			}
		},
		selectFields() {
			var x, i, j, selElmnt, a, b, c;
			x = document.getElementsByClassName("custom-select");
			for (i = 0; i < x.length; i++) {
				selElmnt = x[i].getElementsByTagName("select")[0];
				a = document.createElement("DIV");
				a.setAttribute("class", "select-selected");
				a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
				x[i].appendChild(a);
				b = document.createElement("DIV");
				b.setAttribute("class", "select-items select-hide");
				for (j = 1; j < selElmnt.length; j++) {
					c = document.createElement("DIV");
					c.innerHTML = selElmnt.options[j].innerHTML;
					c.addEventListener("click", function (e) {
						var y, i, k, s, h;
						s = this.parentNode.parentNode.getElementsByTagName("select")[0];
						h = this.parentNode.previousSibling;
						for (i = 0; i < s.length; i++) {
							if (s.options[i].innerHTML == this.innerHTML) {
								s.selectedIndex = i;
								h.innerHTML = this.innerHTML;
								y = this.parentNode.getElementsByClassName("same-as-selected");
								for (k = 0; k < y.length; k++) {
									y[k].removeAttribute("class");
								}
								this.setAttribute("class", "same-as-selected");
								break;
							}
						}
						h.click();
					});
					b.appendChild(c);
				}
				x[i].appendChild(b);
				a.addEventListener("click", function (e) {
					e.stopPropagation();
					closeAllSelect(this);
					this.nextSibling.classList.toggle("select-hide");
					this.classList.toggle("select-arrow-active");
				});
			}
			function closeAllSelect(elmnt) {
				var x, y, i, arrNo = [];
				x = document.getElementsByClassName("select-items");
				y = document.getElementsByClassName("select-selected");
				for (i = 0; i < y.length; i++) {
					if (elmnt == y[i]) {
						arrNo.push(i)
					} else {
						y[i].classList.remove("select-arrow-active");
					}
				}
				for (i = 0; i < x.length; i++) {
					if (arrNo.indexOf(i)) {
						x[i].classList.add("select-hide");
					}
				}
			}
			document.addEventListener("click", closeAllSelect);
		}
	},
	mounted: function(){	
		this.selectFields();
		if (window.location.href.indexOf("success") != -1){
			this.showMain = false
		}
	},
	created: function () {
		window.onbeforeunload = s => this.showSave ? "" : null;
		this.checkDiversity();
		axios.defaults.headers.common = {
			'X-Requested-With': 'XMLHttpRequest',
			'X-CSRF-TOKEN': window.csrf_token
		};
		this.loading = true;
		axios.get("/!/FormSaves/Forms/" + this.userName).then((response) => {
			if (response.data) {
				this.loading = false;
				this.userForms = response.data;
				var a = JSON.parse(JSON.stringify(response.data.find(form => form.form === this.formTitle)))
				this.hasSaved = true
				this.formValue = a['saved'][0];
			} else {
				this.hasSaved = false
				this.loading = false;
			}
		}, (error) => {
			this.loading = false;
			this.error = error;
		})
	},
})
