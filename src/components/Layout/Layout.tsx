import React from 'react';

import styles from './Layout.module.css';

export interface ILayoutProps {
	children: React.ReactNode;
}

export const Layout = (props: ILayoutProps) => {
	const { children } = props;

	return <main className={styles['container']}>{children}</main>;
};
