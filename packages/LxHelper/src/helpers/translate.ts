export const translateScreenName = (
  t: (...args: any) => string,
  screenKey: string,
  name = "name"
): string => {
  // name is either 'name' or 'short_name'
  // projects/admin/public/static/locales/en/common.json
  return t(`common:screen.${screenKey}.${name}`);
};

export default {
  translateScreenName
};
