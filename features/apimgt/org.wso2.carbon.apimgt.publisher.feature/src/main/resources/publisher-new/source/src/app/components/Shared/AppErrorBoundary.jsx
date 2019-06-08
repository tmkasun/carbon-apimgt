/*
 * Copyright (c) 2018, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import React from 'react';
import { Toolbar, AppBar } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import Footer from 'AppComponents/Base/Footer/Footer';

const styles = theme => ({
    appBar: {
        zIndex: theme.zIndex.modal + 1,
        position: 'relative',
        background: theme.palette.background.appBar,
    },
    typoRoot: {
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        textTransform: 'capitalize',
    },
    brandLink: {
        color: theme.palette.primary.contrastText,
    },
    toolbar: {
        minHeight: 56,
        [`${theme.breakpoints.up('xs')} and (orientation: landscape)`]: {
            minHeight: 48,
        },
        [theme.breakpoints.up('sm')]: {
            minHeight: 64,
        },
    },
    menuIcon: {
        color: theme.palette.getContrastText(theme.palette.background.appBar),
        fontSize: 35,
    },
    errorDisplay: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    errorDisplayContent: {
        width: 960,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',
    },
    errorTitle: {
        display: 'flex',
        alignItems: 'center',
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
        '& h2': {
            paddingLeft: theme.spacing.unit * 2,
        },
    },
    link: {
        color: theme.palette.getContrastText(theme.palette.background.default),
    },
});
/**
 * Error boundary for the application.catch JavaScript errors anywhere in their child component tree,
 * log those errors, and display a fallback UI instead of the component tree that crashed.
 * Error boundaries catch errors during rendering, in lifecycle methods,
 * and in constructors of the whole tree below them.
 * @class AppErrorBoundary
 * @extends {Component}
 */
class AppErrorBoundary extends React.Component {
    /**
     * Creates an instance of AppErrorBoundary.
     * @param {any} props @inheritDoc
     * @memberof AppErrorBoundary
     */
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
        };
    }

    /**
     * The componentDidCatch() method works like a JavaScript catch {} block, but for components.
     * @param {Error} error is an error that has been thrown
     * @param {Object} info info is an object with componentStack key. The property has information about component
     * stack during thrown error.
     * @memberof AppErrorBoundary
     */
    componentDidCatch(error, info) {
        this.setState({ hasError: true, error, info });
    }

    /**
     * Return error handled UI
     * @returns {React.Component} return react component
     * @memberof AppErrorBoundary
     */
    render() {
        const { hasError, error, info } = this.state;
        const { children, classes, theme } = this.props;
        const errorStackStyle = {
            background: '#fff8dc',
        };
        if (hasError) {
            return (
                <React.Fragment>
                    <AppBar className={classes.appBar} position='fixed'>
                        <Toolbar className={classes.toolbar}>
                            <div className={classes.errorDisplay} style={{ width: '100%' }}>
                                <div className={classes.errorDisplayContent}>
                                    <a href='/publisher-new'>
                                        <img src={theme.custom.logo} alt={theme.custom.title} />
                                    </a>
                                </div>
                            </div>
                        </Toolbar>
                    </AppBar>

                    <div className={classes.errorDisplay}>
                        <div className={classes.errorDisplayContent}>
                            <div className={classes.errorTitle}>
                                <img src='/publisher-new/site/public/images/robo.png' alt='OOPS' />
                                <Typography variant='h2' gutterBottom>
                                    Something went wrong
                                </Typography>
                            </div>
                            <a href='/publisher-new/apis/'>
                                <h3 className={classes.link}>API Listing</h3>
                            </a>
                        </div>
                    </div>
                    <div className={classes.errorDisplay}>
                        <div className={classes.errorDisplayContent}>
                            <h3 style={{ color: 'red' }}>{error.message}</h3>
                            <pre style={errorStackStyle}>
                                <u>{error.stack}</u>
                            </pre>
                            <pre style={errorStackStyle}>
                                <u>{info.componentStack}</u>
                            </pre>
                        </div>
                    </div>
                    <Footer />
                </React.Fragment>
            );
        } else {
            return children;
        }
    }
}

AppErrorBoundary.propTypes = {
    children: PropTypes.node.isRequired,
    classes: PropTypes.shape({}).isRequired,
    theme: PropTypes.shape({}).isRequired,
};

export default withStyles(styles, { withTheme: true })(AppErrorBoundary);
