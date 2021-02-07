import React from "react";

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.handleclick = this.handleclick.bind(this);
    this.state = {
      nooptions: true,
      difficulty: false,
      highscore: false,
      reset: false,
      options: true,
      restartcolor: "red",
      difficultyindicator: "Easy",
    };

    this.props.parentCallback(false);
    this.props.parentcallback("easy");
  }

  handleclick(e) {
    if (e.target.id === "optionsbutton") {
      this.setState({ nooptions: false });
    }
    if (e.target.id === "closeoptions") {
      this.setState({ nooptions: true });
    }
    if (e.target.id === "difficultybutton") {
    }
    if (e.target.id === "backbutton") {
      this.setState({ options: true });
    }
    if (e.target.id === "difficultybutton") {
      if (this.state.difficultyindicator === "Easy") {
        this.setState({ difficultyindicator: "Medium" });
        this.props.parentcallback("medium");
      } else if (this.state.difficultyindicator === "Medium") {
        this.setState({ difficultyindicator: "Hard" });
        this.props.parentcallback("hard");
      } else if (this.state.difficultyindicator === "Hard") {
        this.setState({ difficultyindicator: "Easy" });
        this.props.parentcallback("easy");
      }
    }
    if (e.target.id === "autorestart") {
      if (this.state.restartcolor === "red") {
        this.setState({ restartcolor: "green" });
        this.props.parentCallback(true);
        localStorage.setItem("autorestart", true);
        e.preventDefault();
      } else {
        this.setState({ restartcolor: "red" });
        this.props.parentCallback(false);
        e.preventDefault();
      }
    }
  }
  componentDidMount() {
    window.addEventListener("click", this.handleclick);
  }

  render() {
    if (this.state.nooptions) {
      return (
        <header>
          <div>
            <h2 className="nav-content" id="optionsbutton">
              Options
            </h2>
          </div>
          <div>
            <a
              href="index.html"
              target="_self"
              style={{ textDecoration: "none" }}
            >
              <h1 className="nav-content"> Glance Typing</h1>
            </a>
          </div>
          <a
            href="about.html"
            target="_self"
            style={{ textDecoration: "none" }}
          >
            <div className="nav-content" style={{ fontSize: "27px" }}>
              About
            </div>
          </a>
        </header>
      );
    }
    if (!this.state.nooptions && this.state.options) {
      return (
        <header>
          <h2 className="nav-content">Options</h2>

          <div>
            <a
              href="index.html"
              target="_self"
              style={{ textDecoration: "none" }}
            >
              <h1 className="nav-content"> Glance Typing</h1>
            </a>
          </div>
          <a
            href="about.html"
            target="_self"
            style={{ textDecoration: "none" }}
          >
            <div className="nav-content" style={{ fontSize: "27px" }}>
              About
            </div>
          </a>
          <div className="optionsdiv">
            <h1 className="options-content" id="difficultybutton">
              Difficulty :{this.state.difficultyindicator}
            </h1>
            <h1 className="options-content">
              Highscore : {localStorage.getItem("wpm")}
            </h1>
            <h1
              className="options-content"
              id="autorestart"
              style={{ color: this.state.restartcolor }}
            >
              Auto restart
            </h1>
            <div className="close" id="closeoptions">
              X
            </div>
          </div>
        </header>
      );
    }
  }
}

export default Header;
