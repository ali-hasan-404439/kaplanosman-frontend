import { ConfigProvider } from 'antd';
import React from 'react';

const AntdConfigProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#1f1f1f',
                },
            }}
        >
            {children}
        </ConfigProvider>
    );
};

export default AntdConfigProvider;