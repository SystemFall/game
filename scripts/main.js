var game = new Vue({
  el: ".game",
  data: {
    buttons: [
      { index: 1, condition: "inactive" },
      { index: 2, condition: "inactive" },
      { index: 3, condition: "inactive" },
      { index: 4, condition: "inactive" },
    ],
    diff: [
      { factor: 1.5, name: "Лёгкая" },
      { factor: 1, name: "Средняя" },
      { factor: 0.4, name: "Сложная" },
    ],
    difficulty: 0.4,
    chain: [],
    user_chain: [],
    round: 0,
    check: 0.4,
    notice_visible: false,
    click_blocking: "false",
    disable_control: "true",
  },
  methods: {
    play(path) {
      if (path) {
        var audio = new Audio("audio/" + path + ".ogg");
        audio.play();
      }
    },
    rand() {
      return Math.floor(Math.random() * 4);
    },
    triggerButton(index, i) {
      this.play(index + 1);
      this.buttons[index].condition = "active";
      setTimeout(() => (this.buttons[index].condition = "inactive"), 200);
      if (i == this.chain.length) {
        this.click_blocking = "true";
        this.user_chain = [];
      }
    },
    start() {
      if (this.chain.length == 0) this.round = 0;
      this.disable_control = "false";
      this.notice_visible = false;
      this.click_blocking = "false";
      var currentButton = null;
      currentButton = this.rand();
      this.chain.push(currentButton);
      for (var i = 1; i < this.chain.length + 1; i++) {
        setTimeout(
          this.triggerButton,
          this.difficulty * 1000 * i,
          this.chain[i - 1],
          i
        );
      }
    },
    buttonClick(index) {
      if (this.click_blocking == "true") {
        this.play(index);
        this.user_chain.push(index - 1);
        if (
          String(this.user_chain) ==
          String(this.chain.slice(0, this.user_chain.length))
        ) {
          if (
            this.chain.length == this.user_chain.length &&
            String(this.chain) == String(this.user_chain)
          ) {
            this.round++;
            setTimeout(() => this.start(), 300);
          }
        } else {
          this.notice_visible = true;
          this.click_blocking = false;
          this.chain = [];
          this.disable_control = "true";
        }
      }
    },
    notice() {
      return "Игра окончена. Количество раундов: " + this.round;
    },
  },
});
