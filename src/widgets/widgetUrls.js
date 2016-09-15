import {IGNORE_OPTIONAL_WIDGET_PARAM, UNREGISTERED_PAYMENTPROVIDER_PARAM} from '../consts';


/**
 * Get the tenant host url
 * 
 */
export function getTenantHost(sqh_config) {
    const domain = (typeof sqh_config.host === 'undefined') ? 'app.referralsaasquatch.com' : sqh_config.host;
    return `${window.location.protocol}//${domain}/a/${sqh_config.tenant_alias}/`;
}

/**
 * 
 * Builds a Widget URL based on the params in `sqh_config`
 * 
 * @param {Object} sqh_config an object containing the details for the user to set up
 * @param {string} pageType the page type
 * 
 */
export function getFrameUrl(sqh_config, pageType) {
    let paymentProviderId;
    let systemId;

    //Check for the legacy case (aka: account_id field is actually the 'paymentProviderId'
    if (sqh_config.payment_provider_id == IGNORE_OPTIONAL_WIDGET_PARAM) {
        paymentProviderId = sqh_config.account_id;
        systemId = IGNORE_OPTIONAL_WIDGET_PARAM;
    }
    else if (sqh_config.payment_provider_id == UNREGISTERED_PAYMENTPROVIDER_PARAM) {
        //Unregistered case, where the payment_provider_id is explicitly set to null, and there is a systemId. 
        paymentProviderId = IGNORE_OPTIONAL_WIDGET_PARAM;
        systemId = sqh_config.account_id;
    }
    else {
        //This case is NOT allowed!
        paymentProviderId = sqh_config.payment_provider_id;
        systemId = sqh_config.account_id === null ? "" : sqh_config.account_id;
    }

    let systemAndPaymentProviderAppendString;

    if (systemId != IGNORE_OPTIONAL_WIDGET_PARAM) {
        systemAndPaymentProviderAppendString = 'systemId=' + encodeURIComponent(systemId) +
            ((paymentProviderId != IGNORE_OPTIONAL_WIDGET_PARAM) ? '&paymentProviderId=' + encodeURIComponent(paymentProviderId) : '');
    }
    else {
        systemAndPaymentProviderAppendString = (paymentProviderId != IGNORE_OPTIONAL_WIDGET_PARAM) ? 'paymentProviderId=' + encodeURIComponent(paymentProviderId) : '';
    }

    return getTenantHost(sqh_config) + 'widgets/squatchwidget?' +
        systemAndPaymentProviderAppendString +
        '&userId=' + encodeURIComponent(sqh_config.user_id) +
        ((sqh_config.email != IGNORE_OPTIONAL_WIDGET_PARAM) ? '&email=' + encodeURIComponent(sqh_config.email) : '') +
        '&firstName=' + encodeURIComponent(sqh_config.first_name) +
        '&lastName=' + encodeURIComponent(sqh_config.last_name) +
        ((sqh_config.user_image != IGNORE_OPTIONAL_WIDGET_PARAM) ? '&userImage=' + encodeURIComponent(sqh_config.user_image) : '') +
        ((sqh_config.checksum != IGNORE_OPTIONAL_WIDGET_PARAM) ? '&paramChecksum=' + encodeURIComponent(sqh_config.checksum) : '') +
        ((sqh_config.jwt != IGNORE_OPTIONAL_WIDGET_PARAM) ? '&paramJwt=' + encodeURIComponent(sqh_config.jwt) : '') +
        ((sqh_config.locale != IGNORE_OPTIONAL_WIDGET_PARAM) ? '&locale=' + encodeURIComponent(sqh_config.locale) : '') +
        ((sqh_config.fb_share_image != IGNORE_OPTIONAL_WIDGET_PARAM) ? '&fbShareImage=' + encodeURIComponent(sqh_config.fb_share_image) : '') +
        ((sqh_config.account_status != IGNORE_OPTIONAL_WIDGET_PARAM) ? '&accountStatus=' + encodeURIComponent(sqh_config.account_status) : '') +
        ((sqh_config.referral_code != IGNORE_OPTIONAL_WIDGET_PARAM) ? '&referralCode=' + encodeURIComponent(sqh_config.referral_code) : '') +
        ((sqh_config.user_referral_code != IGNORE_OPTIONAL_WIDGET_PARAM) ? '&userReferralCode=' + encodeURIComponent(sqh_config.user_referral_code) : '') +
        '&pageType=' + pageType + '&mode=' + sqh_config.mode;
}
