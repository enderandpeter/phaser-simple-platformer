import Main from '../Scenes/Main';
import Phaser from 'phaser';
import React, { Component } from 'react';

export const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 },
            debug: false
        }
    },
    scene: Main,
    parent: 'game',
    title: 'A Simple Platformer',
}


export default class Game extends Component {
    componentWillMount(){
        this.props.initializeGame(new Phaser.Game(config));
    }
    render(){
        return <div id="game"></div>;
    }
}