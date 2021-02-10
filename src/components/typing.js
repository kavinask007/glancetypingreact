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
    this.finalsentence = proverbs[Math.round(Math.random() * proverbs.length)];
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
      if (this.num < this.letterarray.length - 1) {
        document.getElementsByClassName("caret")[0].style.left =
          Math.round(this.letterarray[this.num + 1].getClientRects()[0].x) +
          "px";
        document.getElementsByClassName("caret")[0].style.top =
          Math.round(this.letterarray[this.num + 1].getClientRects()[0].y) +
          "px";
      }
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
      if (this.num < this.letterarray.length - 1) {
        document.getElementsByClassName("caret")[0].style.left =
          Math.round(this.letterarray[this.num + 1].getClientRects()[0].x) +
          "px";
        document.getElementsByClassName("caret")[0].style.top =
          Math.round(this.letterarray[this.num + 1].getClientRects()[0].y) +
          "px";
      }
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
    if (this.props.difficulty === "hard" && this.state.testtime === 7) {
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
            Wpm<h1>{this.netwpm}</h1>
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
        d="M549.5 726.5C726.231 726.5 869.5 583.231 869.5 406.5C869.5 229.769 726.231 86.5 549.5 86.5C372.769 86.5 229.5 229.769 229.5 406.5C229.5 583.231 372.769 726.5 549.5 726.5Z"
        fill="black"
        stroke="white"
        stroke-width="23"
      />
      <circle cx="434.01" cy="342.21" r="64.5" fill="white" />
      <circle cx="666.01" cy="342.21" r="64.5" fill="white" />
      <path
        d="M547.814 560.271C537.125 561.026 486.831 565.388 455.197 581.45C450.118 584.107 444.348 585.678 438.396 586.022C428.23 586.506 416.443 583.216 423.468 563.093C434.844 530.18 504.478 491.815 548.277 492.825C590.397 493.797 640.643 506.853 674.774 556.102C678.045 560.84 679.728 566.241 679.646 571.737C679.5 581.842 675.421 594.595 652.504 581.021C621.541 562.691 563.559 560.438 551.934 560.174C550.561 560.145 549.185 560.177 547.814 560.271Z"
        fill="white"
      />
    </svg>
  );
}

export default Typing;
