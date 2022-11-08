/* react */
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
/* props */
import { AdminLang, FieldSetProps, useAdminLang } from 'admin/core';
import { CreateProductFormData } from '../CreateProduct.props';
/* context */
import { useCreateProductContext } from '../CreateProduct.context';
/* components */
import { Button, SelectFieldOptionProps } from 'shared/components';
/* types */
import { MainTitleListItemDTO, TitleListItemDTO } from 'admin/collections/types';
/* assets */
import { MdAddCircle } from 'react-icons/md';
/* styles */
import { ButtonStyles, FieldStyles } from 'shared/styles';
import styles from './CreateProductCollection.module.scss';

export const useCreateProductCollection = () => {
    /* states */
    const {
        /* states */
        mainTitleList,
        addonTitleList,
    } = useCreateProductContext();

    const {
        setValue,
        register,
        watch,
        formState: { errors },
        trigger,
    } = useFormContext<CreateProductFormData>();

    /* main collection */
    const [selectedMainCollection, setSelectedMainCollection] = useState<number | ''>('');
    const [mainCollection, setMainCollection] = useState<MainTitleListItemDTO[]>([]);

    const handleAddToMainCollection = () => {
        if (!selectedMainCollection) return;

        const selected = mainTitleList.find(current => `${current.titleId}` === `${selectedMainCollection}`);

        if (!selected) return;

        setMainCollection(prev => [...prev, selected]);

        setSelectedMainCollection('');
    };

    const handleRemoveFromMainCollection = (titleId: number) => () => {
        setMainCollection(prev => [...prev.filter(current => current.titleId !== titleId)]);
    };

    /* accesory */
    const [selectedAddonCollection, setSelectedAddonCollection] = useState<number | ''>('');
    const [addonCollection, setAddonCollection] = useState<TitleListItemDTO[]>([]);

    const handleAddToAddonCollection = () => {
        if (!selectedAddonCollection) return;

        const selected = addonTitleList.find(current => `${current.titleId}` === `${selectedAddonCollection}`);

        if (!selected) return;

        setAddonCollection(prev => [...prev, selected]);

        setSelectedAddonCollection('');
    };

    const handleRemoveFromAddonCollection = (titleId: number) => () => {
        setAddonCollection(prev => [...prev.filter(current => current.titleId !== titleId)]);
    };

    /* multiple choice */
    const [selectedMultipleChoiceCollection, setSelectedMultipleChoiceCollection] = useState<number | ''>('');
    const [multipleChoiceCollection, setMultipleChoiceCollection] = useState<TitleListItemDTO[]>([]);

    const handleAddToMultipleChoiceCollection = () => {
        if (!selectedMultipleChoiceCollection) return;

        const selected = addonTitleList.find(current => `${current.titleId}` === `${selectedMultipleChoiceCollection}`);

        if (!selected) return;

        setMultipleChoiceCollection(prev => [...prev, selected]);

        setSelectedMultipleChoiceCollection('');
    };

    const handleRemoveFromMultipleChoiceCollection = (titleId: number) => () => {
        setMultipleChoiceCollection(prev => [...prev.filter(current => current.titleId !== titleId)]);
    };

    /* single choice */
    const [selectedSingleChoiceCollection, setSelectedSingleChoiceCollection] = useState<number | ''>('');
    const [singleChoiceCollection, setSingleChoiceCollection] = useState<TitleListItemDTO[]>([]);

    const handleAddToSingleChoiceCollection = () => {
        if (!selectedSingleChoiceCollection) return;

        const selected = addonTitleList.find(current => `${current.titleId}` === `${selectedSingleChoiceCollection}`);

        if (!selected) return;

        setSingleChoiceCollection(prev => [...prev, selected]);

        setSelectedSingleChoiceCollection('');
    };

    const handleRemoveFromSingleChoiceCollection = (titleId: number) => () => {
        setSingleChoiceCollection(prev => [...prev.filter(current => current.titleId !== titleId)]);
    };

    const { translate, lang } = useAdminLang();

    /* reactivity */
    useEffect(() => {
        if (watch('markAsAddon')) return;

        setAddonCollection([]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [watch('markAsAddon')]);

    useEffect(() => {
        setValue(
            'mainCollection',
            mainCollection.map(main => ({ titleId: main.titleId }))
        );
    }, [mainCollection, setValue]);

    useEffect(() => {
        setValue(
            'accesoryCollection',
            addonCollection.map(addon => ({ titleId: addon.titleId }))
        );

        trigger('accesoryCollection');
    }, [addonCollection, setValue, trigger]);

    useEffect(() => {
        setValue(
            'multipleChoice',
            multipleChoiceCollection.map(addon => ({ titleId: addon.titleId }))
        );
    }, [multipleChoiceCollection, setValue]);

    useEffect(() => {
        setValue(
            'singleChoice',
            singleChoiceCollection.map(addon => ({ titleId: addon.titleId }))
        );
    }, [singleChoiceCollection, setValue]);

    /* props */
    /* main collection */
    const mainCollectionTitleProps: FieldSetProps = {
        className: styles.TitleProps,
        field: {
            disabled: true,
        },
        isHintReserved: true,
        hint: {
            children: translate('createproduct.main.title'),
            hasDots: true,
            title: translate('createproduct.main.title'),
        },
    };
    const mainCollectionProps: FieldSetProps = {
        field: {
            className: FieldStyles.OutlinePrimary,
            placeholder: translate('createproduct.main.placeholder'),
            value: selectedMainCollection,
            onChange: (event: any) => setSelectedMainCollection(event.target.value),
            afterContent: (
                <Button
                    onClick={handleAddToMainCollection}
                    className={ButtonStyles.Plain}
                    type="button"
                    title={translate('actions.add')}>
                    <i>
                        <MdAddCircle />
                    </i>
                </Button>
            ),
            strategy: 'select',
            options: mainTitleList.reduce((prev, current) => {
                if (mainCollection.find(selected => `${selected.titleId}` === `${current.titleId}`)) return prev;

                return [
                    ...prev,
                    {
                        label:
                            current.titleCollection.find(collection => collection.lang === lang)?.ref ??
                            current.defaultTitle,
                        value: current.titleId,
                    },
                ];
            }, [] as SelectFieldOptionProps[]),
        },
        isHintReserved: true,
        hint: {
            hasDots: true,
            title: translate('createproduct.main.hint'),
            children: translate('createproduct.main.hint'),
        },
    };
    /* accesory collection */
    const markAsAddonProps: FieldSetProps = {
        className: styles.CheckboxInverse,
        field: {
            className: FieldStyles.OutlinePrimary,
            strategy: 'checkbox',
            placeholder: translate('createproduct.addon.title'),
            ...register('markAsAddon'),
        },
        isHintReserved: true,
        hint: {
            children: translate('createproduct.addon.title'),
            hasDots: true,
            title: translate('createproduct.addon.title'),
        },
    };
    const accesoryCollectionProps: FieldSetProps = {
        field: {
            className: errors.accesoryCollection ? FieldStyles.OutlineDanger : FieldStyles.OutlinePrimary,
            placeholder: translate('createproduct.addon.placeholder'),
            value: selectedAddonCollection,
            onChange: (event: any) => setSelectedAddonCollection(event.target.value),
            afterContent: (
                <Button
                    onClick={handleAddToAddonCollection}
                    className={ButtonStyles.Plain}
                    type="button"
                    title={translate('actions.add')}>
                    <i>
                        <MdAddCircle />
                    </i>
                </Button>
            ),
            strategy: 'select',
            options: addonTitleList.reduce((prev, current) => {
                if (
                    [...addonCollection, ...multipleChoiceCollection, ...singleChoiceCollection].find(
                        selected => `${selected.titleId}` === `${current.titleId}`
                    )
                )
                    return prev;

                return [
                    ...prev,
                    {
                        label:
                            current.titleCollection.find(collection => collection.lang === lang)?.ref ??
                            current.defaultTitle,
                        value: current.titleId,
                    },
                ];
            }, [] as SelectFieldOptionProps[]),
        },
        isHintReserved: true,
        hint: errors.accesoryCollection
            ? {
                  hasDots: true,
                  title: translate(errors.accesoryCollection.message as AdminLang),
                  children: translate(errors.accesoryCollection.message as AdminLang),
              }
            : {
                  hasDots: true,
                  title: translate('createproduct.addon.hint'),
                  children: translate('createproduct.addon.hint'),
              },
    };

    /* multiple choice collection */
    const multipleChoiceCollectionTitleProps: FieldSetProps = {
        className: styles.TitleProps,
        field: {
            disabled: true,
        },
        isHintReserved: true,
        hint: {
            children: translate('createproduct.multiple.title'),
            hasDots: true,
            title: translate('createproduct.multiple.title'),
        },
    };
    const multipleChoiceCollectionProps: FieldSetProps = {
        field: {
            className: FieldStyles.OutlinePrimary,
            placeholder: translate('createproduct.multiple.placeholder'),
            value: selectedMultipleChoiceCollection,
            onChange: (event: any) => setSelectedMultipleChoiceCollection(event.target.value),
            afterContent: (
                <Button
                    onClick={handleAddToMultipleChoiceCollection}
                    className={ButtonStyles.Plain}
                    type="button"
                    title={translate('actions.add')}>
                    <i>
                        <MdAddCircle />
                    </i>
                </Button>
            ),
            strategy: 'select',
            options: addonTitleList.reduce((prev, current) => {
                if (
                    [...addonCollection, ...multipleChoiceCollection, ...singleChoiceCollection].find(
                        selected => `${selected.titleId}` === `${current.titleId}`
                    )
                )
                    return prev;

                return [
                    ...prev,
                    {
                        label:
                            current.titleCollection.find(collection => collection.lang === lang)?.ref ??
                            current.defaultTitle,
                        value: current.titleId,
                    },
                ];
            }, [] as SelectFieldOptionProps[]),
        },
        isHintReserved: true,
        hint: {
            hasDots: true,
            title: translate('createproduct.multiple.hint'),
            children: translate('createproduct.multiple.hint'),
        },
    };
    /* single choice collection */
    const singleChoiceCollectionTitleProps: FieldSetProps = {
        className: styles.TitleProps,
        field: {
            disabled: true,
        },
        isHintReserved: true,
        hint: {
            children: translate('createproduct.single.title'),
            hasDots: true,
            title: translate('createproduct.single.title'),
        },
    };
    const singleChoiceCollectionProps: FieldSetProps = {
        field: {
            className: FieldStyles.OutlinePrimary,
            placeholder: translate('createproduct.single.placeholder'),
            value: selectedSingleChoiceCollection,
            onChange: (event: any) => setSelectedSingleChoiceCollection(event.target.value),
            afterContent: (
                <Button
                    onClick={handleAddToSingleChoiceCollection}
                    className={ButtonStyles.Plain}
                    type="button"
                    title={translate('actions.add')}>
                    <i>
                        <MdAddCircle />
                    </i>
                </Button>
            ),
            strategy: 'select',
            options: addonTitleList.reduce((prev, current) => {
                if (
                    [...addonCollection, ...multipleChoiceCollection, ...singleChoiceCollection].find(
                        selected => `${selected.titleId}` === `${current.titleId}`
                    )
                )
                    return prev;

                return [
                    ...prev,
                    {
                        label:
                            current.titleCollection.find(collection => collection.lang === lang)?.ref ??
                            current.defaultTitle,
                        value: current.titleId,
                    },
                ];
            }, [] as SelectFieldOptionProps[]),
        },
        isHintReserved: true,
        hint: {
            hasDots: true,
            title: translate('createproduct.single.hint'),
            children: translate('createproduct.single.hint'),
        },
    };

    const createProductMainCollectionFields: FieldSetProps[] = [mainCollectionTitleProps, mainCollectionProps];

    const createProductAccesoryCollectionFields: FieldSetProps[] = [
        markAsAddonProps,
        ...(watch('markAsAddon') ? [accesoryCollectionProps] : []),
    ];

    const createProductMultipleChoiceCollectionFields: FieldSetProps[] = [
        multipleChoiceCollectionTitleProps,
        multipleChoiceCollectionProps,
    ];

    const createProductSingleChoiceCollectionFields: FieldSetProps[] = [
        singleChoiceCollectionTitleProps,
        singleChoiceCollectionProps,
    ];

    return {
        createProductMainCollectionFields,
        mainCollection,
        handleRemoveFromMainCollection,
        markAsAddon: watch('markAsAddon'),
        createProductAccesoryCollectionFields,
        addonCollection,
        handleRemoveFromAddonCollection,
        createProductMultipleChoiceCollectionFields,
        multipleChoiceCollection,
        handleRemoveFromMultipleChoiceCollection,
        createProductSingleChoiceCollectionFields,
        singleChoiceCollection,
        handleRemoveFromSingleChoiceCollection,
    };
};
