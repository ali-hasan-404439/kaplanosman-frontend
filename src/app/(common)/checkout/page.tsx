import CheckoutComponent from '@/components/modules/common/Checkout';
import WithAuth from '@/role-wrappers/WithAuth';
import React from 'react';

const CheckoutPage = () => {
    return (
        <WithAuth>
            <CheckoutComponent />
        </WithAuth>
    );
};

export default CheckoutPage;