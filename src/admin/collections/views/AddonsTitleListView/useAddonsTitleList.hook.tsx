/* react */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useOutlet } from 'react-router-dom';
/* props */
import { AddonsTitleListContextProps } from './AddonsTitleList.props';
/* hooks */
import { useActive, useKeyDownEvent, useLoader, useMinWidth } from 'shared/hooks';
import { FieldSetProps, useAdminNotify } from 'admin/core';
/* services */
import { addonsTitleListService } from 'admin/collections/services';
/* utils */
import { isDate, parse } from 'date-fns';
import { isAfterOrEqual, isBeforeOrEqual, matchBreakPoint } from 'shared/utils';
import { MdDangerous } from 'react-icons/md';
/* types */
import { TitleListItemDTO, TitleState } from 'admin/collections/types';
import { FieldStyles } from 'shared/styles';

interface AddonsTitleListFilterForm {
    name: string;
    state: TitleState | '';
    fromDate: Date | null;
    toDate: Date | null;
}

export const useAddonsTitleList = () => {
    /* states */
    const { handleSubmit, register, setValue } = useForm<AddonsTitleListFilterForm>();

    const [titles, setTitles] = useState<TitleListItemDTO[]>([]);
    const [selectedTitleToUpdate, setSelectedTitleToUpdate] = useState<TitleListItemDTO | null>(null);
    const [selectedTitleToUpdateState, setSelectedTitleToUpdateState] = useState<TitleListItemDTO | null>(null);

    const [filter, setFilter] = useState<AddonsTitleListFilterForm | null>(null);

    const { showLoader, hideLoader } = useLoader();

    const { notify } = useAdminNotify();

    const [bp] = useMinWidth();

    const [isDropFilter, showDropFilter, hideDropFilter] = useActive();

    useKeyDownEvent(event => event.key === 'Escape' && hideDropFilter());

    const isBreakPoint = useMemo(() => matchBreakPoint('md', bp).on, [bp]);

    const { t } = useTranslation();

    const addonsTitleList = useMemo(() => {
        let list = titles.slice();

        if (filter?.name)
            list = list.filter(
                mainTitle =>
                    mainTitle.defaultTitle.toLowerCase().includes(filter.name.toLowerCase()) ||
                    mainTitle.titleCollection.reduce(
                        (prev, current) => prev || current.ref.toLowerCase().includes(filter.name.toLowerCase()),
                        false
                    )
            );

        if (filter?.state) list = list.filter(mainTitle => mainTitle.isActive === filter.state);

        if (isDate(filter?.fromDate))
            list = list.filter(mainTitle =>
                !mainTitle.createdAt ? true : isAfterOrEqual(mainTitle.createdAt, filter?.fromDate as Date)
            );

        if (isDate(filter?.toDate))
            list = list.filter(mainTitle =>
                !mainTitle.createdAt ? true : isBeforeOrEqual(mainTitle.createdAt, filter?.toDate as Date)
            );

        return list;
    }, [titles, filter]);

    const outlet = useOutlet();

    /* functions */
    const handleFilter = handleSubmit(data => {
        const values = { ...data };

        if (data.fromDate) values.fromDate = parse(data.fromDate.toString(), 'yyyy-MM-dd', Date.now());
        if (data.toDate) values.toDate = parse(data.toDate.toString(), 'yyyy-MM-dd', Date.now());

        setFilter(values);

        hideDropFilter();
    });

    const handleResetFilter = () => {
        setValue('name', '');
        setValue('state', '');
        setValue('fromDate', null);
        setValue('toDate', null);

        setFilter(null);

        hideDropFilter();
    };

    const getTitleList = useCallback(async () => {
        showLoader();

        const service = await addonsTitleListService();

        hideLoader();

        if (service.error)
            return notify('danger', {
                title: 'Error',
                icon: <MdDangerous />,
                text: service.message,
                timestamp: new Date(),
            });

        setTitles(service.data);
    }, [hideLoader, notify, showLoader]);

    const handleSelectTitleToUpdate = useCallback(
        (id: number) => {
            setSelectedTitleToUpdate(titles.find(title => title.titleId === id) ?? null);
        },
        [titles]
    );

    const handleUnselectTitleToUpdate = useCallback(() => setSelectedTitleToUpdate(null), []);

    const handleSelectTitleToUpdateState = useCallback(
        (id: number) => {
            setSelectedTitleToUpdateState(titles.find(title => title.titleId === id) ?? null);
        },
        [titles]
    );

    const handleUnselectTitleToUpdateState = useCallback(() => setSelectedTitleToUpdateState(null), []);

    /* reactivity */
    useEffect(() => {
        if (outlet === null) getTitleList();
    }, [getTitleList, outlet]);

    /* props */
    const referenceNameField: FieldSetProps = {
        field: {
            className: FieldStyles.OutlinePrimary,
            placeholder: t('views.addonstitlelist.filter.form.referencename.placeholder'),
            ...register('name'),
        },
        isHintReserved: true,
        hint: {
            hasDots: true,
            children: t('views.addonstitlelist.filter.form.referencename.hint'),
        },
    };

    const stateProps: FieldSetProps = {
        field: {
            className: FieldStyles.OutlinePrimary,
            strategy: 'select',
            placeholder: t('views.addonstitlelist.filter.form.state.placeholder'),
            options: [
                {
                    label: t('views.addonstitlelist.filter.form.state.active'),
                    value: 'active',
                },
                {
                    label: t('views.addonstitlelist.filter.form.state.inactive'),
                    value: 'inactive',
                },
            ],
            ...register('state'),
        },
        isHintReserved: true,
        hint: {
            children: t('views.addonstitlelist.filter.form.state.hint'),
            hasDots: true,
            title: t('views.addonstitlelist.filter.form.state.hint'),
        },
    };

    const fromDateField: FieldSetProps = {
        field: {
            className: FieldStyles.OutlinePrimary,
            placeholder: t('views.addonstitlelist.filter.form.fromdate.placeholder'),
            strategy: 'date',
            ...register('fromDate'),
        },
        isHintReserved: true,
        hint: {
            hasDots: true,
            children: t('views.addonstitlelist.filter.form.fromdate.hint'),
        },
    };

    const toDateField: FieldSetProps = {
        field: {
            className: FieldStyles.OutlinePrimary,
            placeholder: t('views.addonstitlelist.filter.form.todate.placeholder'),
            strategy: 'date',
            ...register('toDate'),
        },
        isHintReserved: true,
        hint: {
            hasDots: true,
            children: t('views.addonstitlelist.filter.form.todate.hint'),
        },
    };

    const filterFormFields: FieldSetProps[] = [referenceNameField, stateProps, fromDateField, toDateField];

    /* context */
    const context: AddonsTitleListContextProps = {
        /* states */
        addonsTitleList,
        selectedTitleToUpdate,
        selectedTitleToUpdateState,
        isDropFilter,
        showDropFilter,
        hideDropFilter,
        isBreakPoint,
        /* functions */
        handleFilter,
        handleResetFilter,
        getTitleList,
        handleSelectTitleToUpdate,
        handleUnselectTitleToUpdate,
        handleSelectTitleToUpdateState,
        handleUnselectTitleToUpdateState,
        /* props */
        filterFormFields,
    };

    return { context };
};