import React from 'react';

import styles from './StatusPage.module.css';

export interface IStatusPageProps {
	title: string;
	description: string;
}

export const StatusPage = (props: IStatusPageProps) => {
	const { title, description } = props;

	return (
		<section className={styles['container']}>
			<span className={styles['title']}>{title}</span>
			<span className={styles['description']}>{description}</span>
		</section>
	);
};
