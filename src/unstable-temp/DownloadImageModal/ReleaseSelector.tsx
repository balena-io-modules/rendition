import * as React from 'react';
import { Flex } from '../../components/Flex';
import { Select } from '../../components/Select';
import { Txt } from '../../components/Txt';
import { Application, Release } from './models';

interface ReleaseOptionProps {
	release?: Release;
	isSelected?: boolean;
}

const ReleaseOption = ({ release, isSelected }: ReleaseOptionProps) => {
	const typeDisplayName = release?.raw_version;

	return (
		<Flex style={{ height: 36 }} py={2} pl={3} width="100%" alignItems="center">
			<Txt ml={2} bold={isSelected}>
				{!isNaN(parseInt(typeDisplayName?.charAt(0) ?? '', 10)) ? 'v' : ''}
				{typeDisplayName}
			</Txt>
		</Flex>
	);
};

interface ReleaseSelectorProps {
	application: Application;
	selectedRelease: Release;
	setSelectedRelease: (release: Release) => void;
	defaultRelease: Release;
	disabled: boolean;
}

const ReleaseSelectorBase = ({
	application,
	selectedRelease,
	setSelectedRelease,
	defaultRelease,
	disabled,
}: ReleaseSelectorProps) => {
	const releasesWithDefault = [defaultRelease].concat(
		application.owns__release,
	);
	const [query, setQuery] = React.useState('');
	const [filteredReleases, setFilteredReleases] =
		React.useState<Release[]>(releasesWithDefault);

	React.useEffect(() => {
		const filtered = releasesWithDefault.filter(
			(r) => r.raw_version.indexOf(query.toLowerCase()) >= 0,
		);

		setFilteredReleases(filtered);
	}, [application, query]);

	return (
		<Select<Release>
			options={filteredReleases}
			valueKey="id"
			labelKey="raw_version"
			value={selectedRelease}
			valueLabel={<ReleaseOption release={selectedRelease} />}
			onChange={({ option }) => {
				setSelectedRelease(option);
				setQuery('');
			}}
			onSearch={setQuery}
			disabled={disabled}
			tooltip={
				disabled
					? 'To enable this dropdown and select a release to preload onto your device, check the "Preload with release" checkbox.'
					: ''
			}
		>
			{(option) => (
				<ReleaseOption
					release={option}
					isSelected={option.id === selectedRelease.id}
				/>
			)}
		</Select>
	);
};

export const ReleaseSelector = React.memo(ReleaseSelectorBase);
