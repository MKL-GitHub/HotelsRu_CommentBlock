class CommentBlock {
    _commentsNumber;
    _userIcon;
    _form;
    _name;
    _date;
    _text;
    _submitBtn;
    _comments;
    

    constructor() {
        this._commentsNumber = document.getElementById("comments-number");
        this._userIcon = document.getElementById("user-icon");
        this._comments = document.getElementById("comments");
        this._form = document.forms.commentsForm;
        this._name = this._form.elements.username;
        this._date = this._form.elements.date;
        this._text = this._form.elements.text;
        this._submitBtn = this._form.elements.submit;

        this.setListeners();
    }

    increaseCommentsNumber() {
        this._commentsNumber.textContent++;
        console.log(this._commentsNumber);
    }

    decreaseCommentsNumber() {
        this._commentsNumber.textContent--;
    }

    setUserIcon() {
        if (this._name.value) {
            const firstLetter = `${this._name.value[0]}`.toUpperCase();
            const color = this.getColorFromString(this._name.value);

            this._userIcon.textContent = firstLetter;
            this._userIcon.style.backgroundColor = color;
        }
        else {
            this._userIcon.textContent = "";
            this._userIcon.style.backgroundColor = "#2e9fff";
        }
    }

    getDate() {
        const today = new Date();
        const todayHours = format(today.getHours());
        const todayMinutes = format(today.getMinutes());
        const todayTime = `${todayHours}:${todayMinutes}`;

        const commentFullDate = new Date(this._date.value);
        const commentDate = commentFullDate.getDate();
        const date = format(commentFullDate.getDate() + 1);
        const month = format(commentFullDate.getMonth() + 1);
        const year = commentFullDate.getFullYear();

        if (!this._date.value) {
            return `сегодня, ${todayTime}`;
        }

        const dateDifference = today.getDate() - commentDate;

        if (today.getFullYear() == commentFullDate.getFullYear() &&
            today.getMonth() == commentFullDate.getMonth()) {
            switch (dateDifference) {
                case 0 : return `сегодня, ${todayTime}`;
                case 1 : return `вчера, ${todayTime}`;
            }
        }

        return `${date}:${month}:${year}, ${todayTime}`;
        
        function format(elem) {
            return "00".substring(`${elem}`.length) + elem;
        }
    }

    resetUserNameAttributes() {
        this._name.setAttribute("data-is-valid", true);
        this._name.parentElement.setAttribute("data-has-only-letters", true);
        this._name.parentElement.setAttribute("data-is-name-empty", false);
        this._name.parentElement.setAttribute("data-is-short", false);
    }

    setDateAttributes() {
        if (this._date.value) {
            this._date.parentElement.setAttribute("data-is-empty", false);
        }
        else {
            this._date.parentElement.setAttribute("data-is-empty", true);
        }
    }

    resetDateAttributes() {
        this._date.parentElement.setAttribute("data-is-empty", true);
    }

    setUserTextFocus() {
        this._text.setAttribute("data-is-focused", true);
    }

    resetUserTextFocus () {
        this._text.setAttribute("data-is-focused", false);
    }

    resetUserTextAttributes() {
        this._text.setAttribute("data-is-empty", false);
        this._text.parentElement.setAttribute("data-is-valid", true);
    }

    setMistakeAnimation(elem) {
        elem.classList.add("mistake");
        setTimeout(() => elem.classList.remove("mistake"), 800);
    }

    isValidSubmit() {
        let hasOnlyLetters = !/[^a-zA-Zа-яА-Я ]/.test(this._name.value);

        if (!hasOnlyLetters || this._name.value.length < 2) {
            this._name.setAttribute("data-is-valid", false);
            this.setMistakeAnimation(this._name)
            this.setMistakeAnimation(this._name.parentElement);
        }
        if (!hasOnlyLetters) {
            this._name.parentElement.setAttribute("data-has-only-letters", false);
        }
        else if (!this._name.value) {
            this._name.parentElement.setAttribute("data-is-name-empty", true);
        }
        else if (this._name.value.length < 2) {
            this._name.parentElement.setAttribute("data-is-short", true);
        }

        if (!this._text.value) {
            this._text.setAttribute("data-is-empty", true);
            this._text.parentElement.setAttribute("data-is-valid", false);
            this.setMistakeAnimation(this._text);
            this.setMistakeAnimation(this._text.parentElement);
        }

        return hasOnlyLetters && this._name.value.length >= 2 && this._text.value;
    }

    handleSubmit(event) {
        this.resetUserNameAttributes();
        this.resetUserTextAttributes();
        event.preventDefault();  // Заглушка, чтобы не отправлять форму, пока не известен адрес сервера.

        if (!this.isValidSubmit()) return;

        const comment = this.createComment();
        this._commentsNumber.textContent++;
        this._comments.prepend(comment);
        this._form.reset();
        this.setUserIcon();
        this.resetDateAttributes();
    }

    handleLikeBtn(event) {
        const likeBtn = event.target.parentElement;
        const likesNumber = likeBtn.parentElement.querySelector(".comments__likes-number");

        if (likeBtn.getAttribute("data-is-liked") == "false") {
            likeBtn.setAttribute("data-is-liked", true);
            likesNumber.textContent++;
        }
        else {
            likeBtn.setAttribute("data-is-liked", false);
            likesNumber.textContent--;
        }
    }

    handleDeleteBtn(event) {
        const comment = event.target.closest(".comments__item");
        comment.remove();
        this._commentsNumber.textContent--;
    }

    handleEnterClick(event) {
        const isTextFocused = this._text.getAttribute("data-is-focused");

        if (event.key == "Enter" && isTextFocused == "false") {
            console.log(isTextFocused, "asdfasdf")
            this.handleSubmit(event);
        }
    }

    createComment() {
        const comment = document.createElement("div");
        const userIcon = this._userIcon.cloneNode(true);
        const date = this.getDate();

        comment.className = "comments__item";
        comment.innerHTML = `
            <div class="comments__body">
                <div class="comments__username">${this._name.value}</div>
                <div class="comments__date">${date}</div>
                <div class="comments__text">${this._text.value}</div>
                <div class="comments__respond">
                    <a class="comments__like" data-is-liked="false">
                        <img src="sources/svg/like.svg" alt="Лайк">
                    </a>
                    <span class="comments__likes-number">0</span>
                </div>
                <a class="comments__delete">
                    <img src="/sources/svg/trash-can.svg" alt="Удалить комментарий">
                </a>
            </div>`;
        comment.prepend(userIcon);

        const likeBtn = comment.querySelector(".comments__like");
        const deleteBtn = comment.querySelector(".comments__delete");

        likeBtn.addEventListener("mouseup", this.handleLikeBtn.bind(this));
        deleteBtn.addEventListener("mouseup", this.handleDeleteBtn.bind(this));

        return comment;
    }

    setListeners() {
        this._name.addEventListener("input", this.setUserIcon.bind(this));
        this._name.addEventListener("input", this.resetUserNameAttributes.bind(this));
        this._date.addEventListener("input", this.setDateAttributes.bind(this));
        this._text.addEventListener("focus", this.setUserTextFocus.bind(this));
        this._text.addEventListener("blur", this.resetUserTextFocus.bind(this));
        this._text.addEventListener("input", this.resetUserTextAttributes.bind(this));
        this._form.addEventListener("submit", this.handleSubmit.bind(this));
        document.addEventListener("keyup", this.handleEnterClick.bind(this));
    }

    getColorFromString(str) {
        let hash = 0;
        let color;

        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }

        color = (hash & 0x00FFFFFF).toString(16);
        
        return  "#000000".substring(0, 7 - color.length) + color;
    }
}

let commentBlock = new CommentBlock();