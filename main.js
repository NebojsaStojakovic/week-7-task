const hamburger = document.querySelector('.header__hamburger');
const closeHamburger = document.querySelector('.header__close');
const header = document.querySelector('.header');
const logo = document.querySelector('.header__logo');
const navLinks = document.querySelectorAll('.header__nav-link');
const bookmark = document.querySelector('.intro__bookmark');
const bookmarkLabel = document.querySelector('.intro__bookmark-label');
const modal = document.querySelector('.modal__overlay');
const openButtons = document.querySelectorAll('.js-openModal');
const specificButtons = { button1: "#bamboo", button2: "#black", button3: "#mahogany" };
const closeModal = document.querySelector('.modal__close');
const modalSections = document.querySelector('.modal__selection');
const modalRadioInputs = document.querySelectorAll('.modal__input');
let pledge = 0;
const continueButtons = document.querySelectorAll('.modal__pledge-btn');
const inputConditions = { option1: 0, option2: 25, option3: 75, option4: 200 };
const confirmation = document.querySelector('.submition__overlay');
const finalizeButton = document.querySelector('.submition__btn');
const totalMoney = document.querySelector('.total-money')
const totalBackers = document.querySelector('.total-backers')
const numbersSection = document.querySelector('.numbers')
const statsContainer = document.querySelector('.numbers__stats')
const progressBar = document.querySelector('.number__progress-bar');
const wrapper = document.querySelector('.wrapper');
const daysleft = document.querySelector('.days-left');
hamburger.addEventListener('click', (e) => {
	e.preventDefault();
	header.classList.add('open-menu');
	document.body.classList.add('lock-scroll');
})
closeHamburger.addEventListener('click', (e) => {
	e.preventDefault();
	header.classList.remove('open-menu');
	document.body.classList.remove('lock-scroll');
})
const hideMobileMenu = () => {
	const menuBars = document.querySelector('.open-menu');
	if (window.innerWidth <= 768 && menuBars) {
		menuBars.classList.toggle('open-menu');
		document.body.classList.remove('lock-scroll');
	}
}
navLinks.forEach(link => {
	link.addEventListener('click', hideMobileMenu);
})
logo.addEventListener('click', hideMobileMenu);
bookmark.addEventListener('click', () => {
	bookmark.classList.toggle('active');
	if (bookmark.classList.contains('active')) {
		bookmarkLabel.innerHTML = "Bookmarked";
	} else {
		bookmarkLabel.innerHTML = "Bookmark";
	};
});
function toggleModal() {
	modal.classList.toggle('open-modal');
}
openButtons.forEach(btn => {
	btn.addEventListener('click', () => {
		toggleModal();
		document.body.classList.add('lock-scroll');
		if (btn.classList.contains('project-btn')) {
			const inputID = specificButtons[btn.id];
			const checkedOption = document.querySelector(inputID);
			checkedOption.checked = true;
			selectNew(checkedOption);
		};
	});
});
const selectNew = select => {
	const parentSelection = select.parentElement.parentElement.parentElement;
	parentSelection.classList.toggle('active');
	const pledge = document.querySelector('.modal__selection.active .modal__pledge');
	pledge.style.maxHeight = pledge.scrollHeight + "px";
	select.checked = true;
	setTimeout(() => parentSelection.scrollIntoView({ behavior: 'smooth' }), 300);
};
closeModal.addEventListener('click', () => {
	toggleModal();
	document.body.classList.remove('lock-scroll');
	clearSelect()
})
modalRadioInputs.forEach(modalRadioInput => {
	modalRadioInput.addEventListener('change', () => {
		clearSelect();
		selectNew(modalRadioInput);
	});
});
const clearSelect = () => {
	const currentSelection = document.querySelector('.modal__selection.active');
	if (currentSelection) {
		const radio = document.querySelector('.modal__selection.active .modal__input');
		const pledge = document.querySelector('.modal__selection.active .modal__pledge');
		const currentInput = document.querySelector('.modal__selection.active .modal__pledge input');
		currentSelection.classList.remove('active');
		radio.checked = false;
		pledge.style.maxHeight = 0;
		setTimeout(() => {
			currentInput.parentElement.parentElement.classList.remove('error');
			currentInput.value = "";
		}, 300);
	};
};
const updateStock = () => {
	const selector = document.querySelector('.modal__selection.active .modal__input').getAttribute('value');
	const options = document.querySelectorAll(`.option.${selector}`);
	const stock = document.querySelectorAll(`.option.${selector} h6`)
	if (selector !== 'noReward') {
		const newStock = Number(stock[0].innerHTML) - 1;
		stock.forEach(s => {
			s.innerHTML = newStock.toString();
		});
		if (newStock === 0) {
			options.forEach(option => {
				option.classList.add('inactive');
				document.querySelectorAll('.option.inactive button').forEach(btn => {
					btn.innerHTML = 'Out of Stock';
					btn.style.background = 'var(--Dark-gray)'
				});
			});
		};
	};;
};
const resetModal = () => {
	setTimeout(() => {
		clearSelect();
		closeModal.scrollIntoView();
	}, 300);
};
continueButtons.forEach(btn => {
	btn.addEventListener('click', event => {
		event.preventDefault();
		const input = document.querySelector('.modal__selection.active .modal__pledge-amount input');
		const inputID = input.id;
		pledge = Number(input.value);
		if (!pledge || pledge < inputConditions[inputID]) {
			input.parentElement.parentElement.classList.add('error');
		} else {
			input.parentElement.parentElement.classList.remove('error');
			updateStock();
			resetModal();
			toggleModal();
			setTimeout(() => {
				confirmation.classList.toggle('open-modal');
			}, 300);
		};
	});
});
finalizeButton.addEventListener('click', () => {
	confirmation.classList.toggle('open-modal');
	numbersSection.classList.toggle('loading');
	const newTotal = Math.round(parseFloat(totalMoney.innerHTML.replace(",", "")) + pledge);
	let totalString = newTotal.toString();
	const newBackers = (parseFloat(totalBackers.innerHTML.replace(",", "")) + 1).toString();
	let backersString = newBackers.toString();
	for (let i = 3; i < totalString.length; i += 4) {
		totalString = totalString.slice(0, -i) + "," + totalString.slice(-i);
	}
	for (let i = 3; i < backersString.length; i += 3) {
		backersString = backersString.slice(0, -i) + "," + backersString.slice(-i);
	}
	numbersSection.scrollIntoView({ behavior: 'smooth' });
	setTimeout(() => {
		totalMoney.innerHTML = totalString;
		totalBackers.innerHTML = backersString;
		numbersSection.classList.toggle('loading');
		progressBar.style.maxWidth = "100%";
		let newWidth = newTotal * 100 / 100000;
		if (newWidth < 100) {
			progressBar.style.width = newWidth + "%";
		} else {
			progressBar.style.width = "100%";
			wrapper.classList.add('inactive')
		};
		document.body.classList.remove('lock-scroll');
	}, 300);
});
const daysLeftUntilEnd = (date, otherDate) => {
	const leftedDays = Math.ceil((otherDate - date) / (1000 * 60 * 60 * 24));
	if (leftedDays <= 0) {
		wrapper.classList.add('inactive')
	}
	return leftedDays;
};
daysleft.innerHTML = daysLeftUntilEnd(new Date('2021-10-21'), new Date('2022-01-01'));
window.addEventListener('click', function (e) {
	let currentTarget = e.target;
	if (currentTarget == modal) {
		modal.classList.remove('open-modal');
		document.body.classList.remove('lock-scroll');
		clearSelect();
	}
});
window.addEventListener('keydown', e => {
	if (e.key === 'Escape') {
		modal.classList.remove('open-modal');
		header.classList.remove('open-menu');
		document.body.classList.remove('lock-scroll');
		clearSelect();
	}
});