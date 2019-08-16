import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControl from '@material-ui/core/FormControl';
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import HelpOutline from '@material-ui/icons/HelpOutline';
import { FormattedMessage } from 'react-intl';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    error: {
        color: theme.palette.error.main,
    },
}));
/**
 *
 *
 * @export
 * @param {*} props
 * @returns
 */
export default function Transports(props) {
    const { api, configDispatcher } = props;
    const classes = useStyles();
    const Validate = () => {
        if (api.transport.length === 0) {
            return (
                <FormattedMessage
                    id='Apis.Details.Configuration.components.transport.empty'
                    defaultMessage='Please select at least one transport!'
                />
            );
        }
        return null; // No errors :-)
    };
    return (
        <Grid container spacing={1} alignItems='flex-start'>
            <Grid item>
                <FormControl component='fieldset'>
                    <FormLabel component='legend'>
                        <FormattedMessage
                            id='Apis.Details.Configuration.Configuration.transports'
                            defaultMessage='Transports'
                        />
                    </FormLabel>
                    <FormGroup>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={api.transport.includes('http')}
                                    onChange={({ target: { checked } }) =>
                                        configDispatcher({
                                            action: 'transport',
                                            event: { checked, value: 'http' },
                                        })
                                    }
                                    value='http'
                                />
                            }
                            label='HTTP'
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={api.transport.includes('https')}
                                    onChange={({ target: { checked } }) =>
                                        configDispatcher({
                                            action: 'transport',
                                            event: { checked, value: 'https' },
                                        })
                                    }
                                    value='https'
                                />
                            }
                            label='HTTPS'
                        />
                    </FormGroup>
                </FormControl>
            </Grid>
            <Grid item>
                <Tooltip
                    title={
                        <FormattedMessage
                            id='Apis.Details.Configuration.components.Transports.tooltip'
                            defaultMessage='API will be exposed in selected transport(s) in the gateway(s)'
                        />
                    }
                    aria-label='Transports'
                    placement='right-end'
                    interactive
                >
                    <HelpOutline />
                </Tooltip>
            </Grid>
            <Grid item>
                <span className={classes.error}>
                    <Validate />
                </span>
            </Grid>
        </Grid>
    );
}


Transports.propTypes = {
    api: PropTypes.shape({}).isRequired,
    configDispatcher: PropTypes.func.isRequired,
};
