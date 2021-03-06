/*
  author: Anna Kuzii
*/

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom'; //temporarily here, remove it!!!!!!!
import { openSignUpForm } from '~/src/redux/actions/authorization';
import { startCharacterCreation } from '~/src/redux/actions/characterCreation';
import SignUpFormPopup from '~/src/authentication/SignUpForm';
import Authorize from '~/src/authentication/Authorize';
import LandingPageContent from "~/src/theme/components/landingPage/LandingPageContent";
import Houses from "~/src/theme/components/houses/Houses";
import Heroes from "~/src/theme/components/heroes/Heroes";
import PrivacyPolicy from '~/src/theme/new_ui/PrivacyPolicy';
import TermsOfUse from '~/src/theme/new_ui/TermsOfUse';
import CharacterCreationFlow from "~/src/theme/components/characterCreation/CharacterCreationFlow";

import '~/src/theme/css/landingPage.css';
import '~/src/theme/css/materialize.css';
import '~/src/theme/css/materializeCommon.css';

//mailerlite subscribe
import Axios from 'axios';
import ConfigMain from '~/configs/main';
import SubscribeThanksModal from "~/src/theme/components/SubscribeThanksModal";

const validateEmail = (email) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

//this one is for desktop only, for mobile, there is simple input element
const EmailInput = ({ onEmailInputHide, onEmailInputSubmit, onEmailInput, email }) => {
  const handleInputSubmit = (event) => {
    event.preventDefault();
    if (validateEmail(email)) {
      onEmailInputSubmit(email);
    }
  }

  return (
    <span>
      <span className="landing-email-input-textfield-container">
        <input value={email}
          onChange={onEmailInput}
          onKeyPress={(event) => {
            if (event.key === 'Enter') {
              handleInputSubmit(event)
            }
          }}
          type="email" placeholder="email@example.com" autoFocus={true} />
      </span>,
    <button type="submit" onClick={handleInputSubmit}><p>Send</p></button>
    </span>
  )
}

//

const Footer = () => {
  return (
    <footer className="footer">
      <a href="/" className="footer-logo">
        <img
          src="https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/landingPage/logo.png"
          alt="logo"
        />
      </a>
      <h3>Subscribe to our Newsletter</h3>
      <div><input type="email" className="mail" value="Mail" /></div>
      <button type="button" className="subscribe"><p>Subscribe</p></button>
      <ul className="info-list">
        <li>About</li>
        <li>Support</li>
        <li>Contact</li>
        <li>Press</li>
      </ul>
      <h4>&#169;2018 SOQQLE, INC. ALL RIGHTS RESERVED.<br />
        All trademarks referenced herein are the properties of their respective owners.</h4>
      <ul className="privacy-list">
        <li><a href="/privacyPolicy" target="_blank">Privacy</a></li>
        <li><a href="/termsOfUse" target="_blank">Terms</a></li>
      </ul>
    </footer>
  );
};

const Header = ({ openMenu, onEmailInputShow, onEmailInputHide, onEmailInputSubmit, onEmailInput, isEmailInputVisible, email }) => {
  return (
    <div className="header">
      <button className="burger" onClick={openMenu}>
        <span> </span>
        <span> </span>
        <span> </span>
      </button>
      <button type="button">
        <p>The Game</p>
      </button>
      <button type="button">
        <p>Forums</p>
      </button>
      <button type="button">
        <p>Markets</p>
      </button>
      {
        process.env.SOQQLE_ENV !== 'production' && 
        (!isEmailInputVisible
          ? <button type="button" className="subscribe-button" onClick={onEmailInputShow}>
            <p>Subscribe</p>
          </button>
          : <EmailInput onEmailInputHide={onEmailInputHide} onEmailInputSubmit={onEmailInputSubmit} onEmailInput={onEmailInput} email={email} />
        )
      }
      
      {/* {!isEmailInputVisible
        ? <button type="button" className="subscribe-button" onClick={onEmailInputShow}>
          <p>Subscribe</p>
        </button>
        : <EmailInput onEmailInputHide={onEmailInputHide} onEmailInputSubmit={onEmailInputSubmit} onEmailInput={onEmailInput} email={email} />} */}
      {
        process.env.SOQQLE_ENV !== 'production' && 
        <button type="button" className="sign-up-button">
          <p>Enterprise sign up</p>
        </button>
      }
    </div>
  );
};

const Logo = () => {
  return (
    <div className="logo">
      <a href="/">
        <img
          src="https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/landingPage/logo.png"
          alt="logo"
        />
      </a>
    </div>
  );
};

const MobileMenu = ({ isOpen, closeMenu, onEmailInputShow, onEmailInputHide, onEmailInputSubmit, onEmailInput, isEmailInputVisible, email }) => {
  const mobileClass = isOpen ? 'mobile-menu open' : 'mobile-menu close';

  const handleInputSubmit = (event) => {
    event.preventDefault();
    if (validateEmail(email)) {
      onEmailInputSubmit(email);
    }
  }

  return (
    <div className={mobileClass}>
      <button type="button" className="close-menu" onClick={closeMenu}>
        <span>x</span>
      </button>
      <div className="mobile-logo">
        <a href="/">
          <img
            src="https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/landingPage/logo.png"
            alt="logo"
          />
        </a>
      </div>
      <ul>
        <li>The games</li>
        <li>Forums</li>
        <li>Markets</li>
      </ul>
      <footer>
        <div className="mobile-menu-email-subscribe-container">
          <div className="landing-email-input-textfield-container">
            <input value={email}
              onKeyPress={(event) => {
                //doesn't make sense for mobile, but her for consistency
                if (event.key === 'Enter') {
                  handleInputSubmit(event)
                }
              }}
              onChange={onEmailInput}
              type="email" placeholder="email@example.com" autoFocus={true} required={true} />
          </div>
        </div>
        <button type="button" className="subscribe-button" onClick={handleInputSubmit}><p>Subscribe</p></button>
        <button type="button" className="sign-up-button"><p>Enterprise sign up</p></button>
      </footer>
    </div>
  );
};

class LandingPage extends Component {
  constructor(props) {
    super(props);
    this.state = { isOpen: false, isEmailInputVisible: false, email: "", isSubscriptionModalVisible: false, };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  //mailerlite subscribe
  handleEmailInputShow(show) {
    this.setState({ isEmailInputVisible: show });
  }

  handleEmailInputSubmit(value) {
    if (value) {
      const body = { groupId: 9716454, name: "n/a", email: value };
      Axios.post(`${ConfigMain.getBackendURL()}/addSubscriberToGroup`, body)
        .then((response) => {
        })
        .catch(error => {
        });
      this.setState({ email: "", isEmailInputVisible: false, isSubscriptionModalVisible: true });
    }
  }

  handleEmailInput(event) {
    this.setState({ email: event.target.value });
  }

  handleCloseSubscribeThankYouModal() {
    this.setState({ isSubscriptionModalVisible: false });
  }
  //

  renderSignUpForm() {
    return this.props.isSignUpFormOpen ? (
      <SignUpFormPopup
        modalIsOpen={this.props.isSignUpFormOpen}
        isAuthorized={this.props.isAuthorized}
        onCloseModal={() => this.props.onCloseSignUpModal()}
        onHandleSignUpFacebook={() => this.props.onHandleSignUpFacebook()}
        onHandleSignUpLinkedIn={() => this.props.onHandleSignUpLinkedIn()}
        pathname={this.props.pathname}
      />
    ) : null;
  }

  renderRoutes() {
    return (
      <Switch>
        <Route exact path='/' render={routeProps => <LandingPageContent {...routeProps}{...this.props}/>}/>
        <Route path='/authorize' render={routeProps => <Authorize {...routeProps}{...this.props}/>}/>
        <Route exact path='/houses' render={routeProps => <Houses {...routeProps}{...this.props}/>}/>
        <Route exact path='/heroes' render={routeProps => <Heroes {...routeProps}{...this.props}/>}/>
        <Route exact path="/privacyPolicy" render={routeProps => <PrivacyPolicy {...routeProps} {...this.props} />}/>
        <Route exact path="/termsOfUse" render={routeProps => <TermsOfUse {...routeProps} {...this.props} />}/>
        <Route exact path='/characterCreation' render={routeProps => <CharacterCreationFlow {...routeProps}{...this.props}/>}/>
        <Route path="*" render={routeProps => <LandingPageContent {...routeProps}{...this.props}/>}/>
      </Switch>
    );
  }

  render() {
    return (
      <div className="landing-page-wrapper landing-page-container">
        {this.renderSignUpForm()}
        <header>
          <SubscribeThanksModal isVisible={this.state.isSubscriptionModalVisible}
            closeSubscribeThankYouModal={() => this.handleCloseSubscribeThankYouModal()} />
          <Logo />
          <Header openMenu={this.toggle}
            onEmailInputShow={() => this.handleEmailInputShow(true)}
            onEmailInputHide={() => this.handleEmailInputShow(false)}
            onEmailInputSubmit={(value) => { this.handleEmailInputSubmit(value) }}
            onEmailInput={(event) => { this.handleEmailInput(event) }}
            isEmailInputVisible={this.state.isEmailInputVisible}
            email={this.state.email} />
        </header>
        {this.renderRoutes() /*This is temporary - remove it!!!!!!!!*/}
        <Footer />
        <MobileMenu isOpen={this.state.isOpen} closeMenu={this.toggle}
          onEmailInputShow={() => this.handleEmailInputShow(true)}
          onEmailInputHide={() => this.handleEmailInputShow(false)}
          onEmailInputSubmit={(event) => { this.handleEmailInputSubmit(event) }}
          onEmailInput={(event) => { this.handleEmailInput(event) }}
          isEmailInputVisible={this.state.isEmailInputVisible}
          email={this.state.email} />
      </div>
    );
  }
}

LandingPage.propTypes = {
  isAuthorized: PropTypes.bool.isRequired,
  isSignUpFormOpen: PropTypes.bool.isRequired,
  startCharacterCreation: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  openSignUpForm: bindActionCreators(openSignUpForm, dispatch),
  startCharacterCreation: bindActionCreators(startCharacterCreation, dispatch),
});

const mapStateToProps = state => ({
  isAuthorized: state.userProfile.isAuthorized,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withCookies(LandingPage));
