import React from 'react';
import PropTypes from 'prop-types';

import './button.scss';

const Button = props => {
    return (
        <button
            className={`btn ${props.className}`}
            onClick={props.onClick ? () => props.onClick() : null}
        >
            {props.children}
        </button>
    );
}

export const OutlineButton = props => {
    return (
        <Button
            className={`btn-outline ${props.className}`}
            onClick={props.onClick ? () => props.onClick() : null}
        >
            {props.children}
        </Button>
    );
}

Button.propTypes = {
    onClick: PropTypes.func
}

export default Button;

export const Buttonplay = props => {
    return (
        <button
            className={`btnplay ${props.className}`}
            onClick={props.onClick ? () => props.onClick() : null}
        >
            {props.children}
        </button>
    );
}

Buttonplay.propTypes = {
    onClick: PropTypes.func
}



export const Buttonsave = props => {
    return (
        <button
            className={`btnsave ${props.className}`}
            onClick={props.onClick ? () => props.onClick() : null}
        >
            {props.children}
        </button>
    );
}

Buttonplay.propTypes = {
    onClick: PropTypes.func
}

export const Buttonz = props => {
    return (
        <button
            className={`btnz ${props.className}`}
            onClick={props.onClick ? () => props.onClick() : null}
        >
            {props.children}
        </button>
    );
}

export const OutlineButtonz = props => {
    return (
        <Buttonz
            className={`btn-outlinez ${props.className}`}
            onClick={props.onClick ? () => props.onClick() : null}
        >
            {props.children}
        </Buttonz>
    );
}

Button.propTypes = {
    onClick: PropTypes.func
}
