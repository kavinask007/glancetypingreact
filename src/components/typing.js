import React from "react";
import proverbs from "./proverbs";
class Typing extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isEnterPressed: false };
    this.enterpress = this.enterpress.bind(this);
    this.enterclick = this.enterclick.bind(this);
  }
  enterpress(e) {
    if (e.keyCode === 13) {
      this.setState({ isEnterPressed: true });
      window.removeEventListener("keydown", this.enterpress);
      window.removeEventListener("click", this.enterclick);
    }
  }

  enterclick(e) {
    if (e.target.id === "enterid") {
      this.setState({ isEnterPressed: true });
      window.removeEventListener("click", this.enterclick);
      window.removeEventListener("keydown", this.enterpress);
    }
  }

  componentDidMount() {
    window.addEventListener("keydown", this.enterpress);
    window.addEventListener("click", this.enterclick);
  }
  render() {
    if (this.state.isEnterPressed) {
      return (
        <main>
          <ErrorBoundary>
            <div className="caret" style={{ display: "none" }}></div>
            <Timer
              autorestart={this.props.autorestart}
              difficulty={this.props.difficulty}
            />
          </ErrorBoundary>
        </main>
      );
    } else {
      return (
        <main>
          <h1 className="nav-content" id="enterid">
            Hit enter to start
          </h1>
        </main>
      );
    }
  }
}

class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.finalsentence =
      proverbs[Math.round(Math.random() * proverbs.length + 1)];
    this.handlekeypress = this.handlekeypress.bind(this);
    this.starteventlistener = this.starteventlistener.bind(this);
    this.state = {
      time: 3,
      istimeover: false,
      tinterv: "",
      wpm: 0,
      accuracy: 0,
      testtime: 0,
      gamerunning: true,
      gamefailed: false,
    };
    this.tick = this.tick.bind(this);
    this.gameover = this.gameover.bind(this);
    this.totalkeystrokes = 0;
    this.correctwords = 0;
    this.wrongwords = 0;
    this.calctesttime = this.calctesttime.bind(this);
    this.gamefailed = this.gamefailed.bind(this);
  }
  tick() {
    if (this.state.time >= 1) {
      this.setState((prevState) => {
        return {
          time: prevState.time - 1,
        };
      });
    }
    if (this.state.time === 0) {
      clearInterval(this.state.tinterv);
      this.setState({ istimeover: true });
      this.starteventlistener();
    }
  }
  handlekeypress(e) {
    if (e.key === "Backspace" && this.num > 0) {
      this.num -= 1;
      document.getElementsByClassName("caret")[0].style.left =
        Math.round(this.letterarray[this.num].getClientRects()[0].x) + "px";
      document.getElementsByClassName("caret")[0].style.top =
        Math.round(this.letterarray[this.num].getClientRects()[0].y) + "px";
      this.letterarray[this.num].style.opacity = 0.2;
      this.letterarray[this.num].style.color = "white";
      this.letterarray[this.num].style.background = "none";
      this.letterarray[this.num].style.width = "30px";
      this.letterarray[this.num].classList.remove("correct");
      this.letterarray[this.num].classList.remove("wrong");
    } else if (this.letterarray[this.num].textContent === e.key) {
      this.totalkeystrokes += 1;
      document.getElementsByClassName("caret")[0].style.left =
        Math.round(this.letterarray[this.num].getClientRects()[0].x) +
        35 +
        "px";
      document.getElementsByClassName("caret")[0].style.top =
        Math.round(this.letterarray[this.num].getClientRects()[0].y) + "px";
      this.letterarray[this.num].classList.add("active");
      this.letterarray[this.num].style.opacity = 1;
      this.letterarray[this.num].style.color = "white";
      this.letterarray[this.num].classList.add("correct");
      this.num += 1;
      if (this.num === this.letterarray.length) {
        this.gameover();
      }
    } else if (e.key !== this.letterarray[this.num].textContent) {
      this.totalkeystrokes += 1;

      document.getElementsByClassName("caret")[0].style.left =
        Math.round(this.letterarray[this.num].getClientRects()[0].x) +
        35 +
        "px";
      document.getElementsByClassName("caret")[0].style.top =
        Math.round(this.letterarray[this.num].getClientRects()[0].y) + "px";
      this.letterarray[this.num].style.opacity = 1;
      if (this.letterarray[this.num].textContent === " ") {
        this.letterarray[this.num].style.background = "red";
        this.letterarray[this.num].style.width = "5px";
        this.letterarray[this.num].classList.add("wrong");
        this.num += 1;
      } else {
        this.letterarray[this.num].style.color = "red";
        this.letterarray[this.num].classList.add("wrong");
        this.num += 1;
        if (this.num === this.letterarray.length) {
          this.gameover();
        }
      }
    }
  }

  starteventlistener() {
    this.testtime = setInterval(this.calctesttime, 1000);
    window.addEventListener("keyup", this.handlekeypress);
    this.letterarray = document.getElementsByClassName("letter");
    this.num = 0;
    document.getElementsByClassName("caret")[0].style.display = "block";
    document.getElementsByClassName("caret")[0].style.left =
      Math.round(this.letterarray[this.num].getClientRects()[0].x) + "px";
    document.getElementsByClassName("caret")[0].style.top =
      Math.round(this.letterarray[this.num].getClientRects()[0].y) + "px";
  }

  gameover() {
    document.getElementsByClassName("caret")[0].style.display = "none";
    window.removeEventListener("keyup", this.handlekeypress);
    clearInterval(this.testtime);
    this.correctwords = document.getElementsByClassName("correct").length;
    this.wrongwords = document.getElementsByClassName("wrong").length;
    this.setState({
      accuracy: Math.round((this.correctwords / this.totalkeystrokes) * 100),
    });
    this.setState({ gamerunning: false });
  }
  gamefailed() {
    document.getElementsByClassName("caret")[0].style.display = "none";
    window.removeEventListener("keyup", this.handlekeypress);
    clearInterval(this.testtime);
    this.setState({ gamerunning: false });
    this.setState({ gamefailed: true });
  }

  calctesttime() {
    if (this.props.difficulty === "hard" && this.state.testtime === 4) {
      this.gamefailed();
    }
    if (this.props.difficulty === "medium" && this.state.testtime === 10) {
      this.gamefailed();
    }
    if (this.props.difficulty === "easy" && this.state.testtime === 20) {
      this.gamefailed();
    }
    this.setState((prevState) => {
      return {
        testtime: prevState.testtime + 1,
      };
    });
  }

  componentDidMount() {
    this.setState({ tinterv: setInterval(this.tick, 1000) });
  }

  render() {
    if (this.state.gamerunning) {
      if (this.state.istimeover) {
        return (
          <div className="typingarea">
            <div className="timer">{Math.round(this.state.testtime)}</div>
            <div className="typerwrap">
              {this.finalsentence.map((e, index) => {
                return (
                  <Word
                    key={index}
                    word={e}
                    ishidden={true}
                    difficulty={this.props.difficulty}
                  />
                );
              })}
            </div>
          </div>
        );
      } else {
        if (!this.finalsentence) {
          this.finalsentence =
            proverbs[Math.round(Math.random() * proverbs.length + 1)];
        }
        return (
          <div className="typingarea">
            <div className="timer">{this.state.time}</div>
            <div className="typerwrap">
              {this.finalsentence.map((e, index) => {
                return (
                  <Word
                    key={index}
                    word={e}
                    ishidden={false}
                    difficulty={this.props.difficulty}
                  />
                );
              })}
            </div>
          </div>
        );
      }
    } else if (!this.state.gamerunning && !this.state.gamefailed) {
      return (
        <Result
          correctwords={this.correctwords}
          wrongwords={this.wrongwords}
          accuracy={this.state.accuracy}
          testtime={Math.round(this.state.testtime)}
          autorestart={this.props.autorestart}
          difficulty={this.props.difficulty}
        />
      );
    } else if (this.state.gamefailed) {
      return (
        <Failed
          autorestart={this.props.autorestart}
          difficulty={this.props.difficulty}
        />
      );
    }
  }
}

function Word(props) {
  const word = props.word.split("");
  return (
    <div className="word">
      {word.map((e, index) => {
        return (
          <Letter
            key={index}
            letter={e}
            ishidden={props.ishidden}
            difficulty={props.difficulty}
          />
        );
      })}
    </div>
  );
}

function Letter(props) {
  var Opacity = 0;
  if (props.difficulty === "easy") {
    Opacity = 0.2;
  } else if (props.difficulty === "medium") {
    Opacity = 0;
  } else if (props.difficulty === "hard") {
    Opacity = 0;
  }
  if (props.ishidden) {
    return (
      <span className="letter" style={{ opacity: Opacity }}>
        {props.letter}
      </span>
    );
  } else {
    return <span className="letter">{props.letter}</span>;
  }
}

class Result extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nextround: false,
      displayraw: false,
    };
    this.nextclick = this.nextclick.bind(this);
    this.wpm = Math.round(
      (this.props.correctwords + this.props.wrongwords) /
        5 /
        (this.props.testtime / 60)
    );
    this.netwpm = Math.round(
      ((this.props.correctwords + this.props.wrongwords) / 5 -
        this.props.wrongwords) /
        (this.props.testtime / 60)
    );
    if (this.netwpm < 0) {
      this.netwpm = 0;
    }
    var highscore = localStorage.getItem("wpm");
    if (this.netwpm > highscore) {
      localStorage.setItem("wpm", this.netwpm);
    }
  }
  nextclick() {
    this.setState({ nextround: true });
  }
  componentDidMount() {
    if (this.wpm === this.netwpm) {
      this.setState({ displayraw: true });
    }
  }
  render() {
    if (
      !this.state.nextround &&
      !this.state.displayraw &&
      !this.props.autorestart
    ) {
      return (
        <div className="resultspage">
          <h1>
            raw wpm<h1>{this.wpm}</h1>
          </h1>
          <h1>
            wpm<h1>{this.netwpm}</h1>
          </h1>
          <h1>
            Accuracy<h1>{this.props.accuracy}%</h1>
          </h1>
          <button onClick={this.nextclick}>Next</button>
        </div>
      );
    }
    if (
      !this.state.nextround &&
      this.state.displayraw &&
      !this.props.autorestart
    ) {
      return (
        <div className="resultspage">
          <h1>
            wpm<h1>{this.netwpm}</h1>
          </h1>
          <h1>
            Accuracy<h1>{this.props.accuracy}%</h1>
          </h1>
          <button onClick={this.nextclick}>Next</button>
        </div>
      );
    }
    if (
      !this.state.nextround &&
      !this.state.displayraw &&
      this.props.autorestart
    ) {
      setTimeout(() => {
        this.nextclick();
      }, 1500);
      return (
        <div className="resultspage">
          <h1>
            raw wpm<h1>{this.wpm}</h1>
          </h1>
          <h1>
            wpm<h1>{this.netwpm}</h1>
          </h1>
          <h1>
            Accuracy<h1>{this.props.accuracy}%</h1>
          </h1>
        </div>
      );
    }
    if (
      !this.state.nextround &&
      this.state.displayraw &&
      this.props.autorestart
    ) {
      setTimeout(() => {
        this.nextclick();
      }, 2000);
      return (
        <div className="resultspage">
          <h1>
            wpm<h1>{this.netwpm}</h1>
          </h1>
          <h1>
            Accuracy<h1>{this.props.accuracy}%</h1>
          </h1>
        </div>
      );
    }
    return (
      <Timer
        autorestart={this.props.autorestart}
        difficulty={this.props.difficulty}
      />
    );
  }
}

class Failed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nextround: false,
    };
    this.nextclick = this.nextclick.bind(this);
  }
  nextclick() {
    this.setState({ nextround: true });
  }
  render() {
    if (!this.state.nextround && !this.props.autorestart) {
      return (
        <div className="resultspage">
          <Svg />
          <h1 className="nav-content">Time Over</h1>
          <button onClick={this.nextclick}>Next</button>
        </div>
      );
    }
    if (!this.state.nextround && this.props.autorestart) {
      setTimeout(() => {
        this.nextclick();
      }, 1500);
      return (
        <div className="resultspage">
          <Svg />
          <h1 className="nav-content">Time Over</h1>
        </div>
      );
    }
    return (
      <Timer
        autorestart={this.props.autorestart}
        difficulty={this.props.difficulty}
      />
    );
  }
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <h1 className="nav-content">
          Something went wrong Please refresh the page
        </h1>
      );
    }

    return this.props.children;
  }
}

function Svg() {
  return (
    <svg viewBox="0 0 1101 812" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M518.99 774.79C695.721 774.79 838.99 631.521 838.99 454.79C838.99 278.059 695.721 134.79 518.99 134.79C342.259 134.79 198.99 278.059 198.99 454.79C198.99 631.521 342.259 774.79 518.99 774.79Z"
        fill="black"
        stroke="white"
        stroke-width="23"
      />
      <path
        d="M69.55 688.41C69.55 690.94 69.26 692.99 68.91 692.99C68.56 692.99 68.28 690.99 68.28 688.41C68.28 685.83 68.63 687.07 68.99 687.07C69.35 687.07 69.55 685.88 69.55 688.41Z"
        fill="#FFD037"
      />
      <path
        d="M73.01 691.43C70.79 692.64 68.86 693.37 68.69 693.06C68.52 692.75 70.19 691.53 72.41 690.32C74.63 689.11 73.75 689.99 73.92 690.32C74.09 690.65 75.27 690.22 73.01 691.43Z"
        fill="#FFD037"
      />
      <path
        d="M20.11 688.41C20.11 690.94 20.39 692.99 20.74 692.99C21.09 692.99 21.37 690.99 21.37 688.41C21.37 685.83 21.02 687.07 20.67 687.07C20.32 687.07 20.11 685.88 20.11 688.41Z"
        fill="#FFD037"
      />
      <path
        d="M16.6 691.43C18.82 692.64 20.76 693.37 20.93 693.06C21.1 692.75 19.43 691.53 17.21 690.32C14.99 689.11 15.86 689.99 15.7 690.32C15.54 690.65 14.38 690.22 16.6 691.43Z"
        fill="#FFD037"
      />
      <circle cx="403.5" cy="390.5" r="64.5" fill="white" />
      <circle cx="635.5" cy="390.5" r="64.5" fill="white" />
      <path
        d="M530.304 608.561C519.615 609.316 469.321 613.678 437.687 629.74C432.608 632.397 426.838 633.968 420.886 634.312C410.72 634.795 398.933 631.506 405.958 611.383C417.334 578.47 486.968 540.105 530.767 541.115C572.887 542.087 623.133 555.143 657.264 604.392C660.535 609.13 662.218 614.531 662.136 620.027C661.99 630.132 657.911 642.885 634.994 629.311C604.031 610.981 546.049 608.728 534.424 608.464C533.051 608.435 531.675 608.467 530.304 608.561Z"
        fill="white"
      />
    </svg>
  );
}

export default Typing;
