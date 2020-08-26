export interface WidgetOption {
    /** The Widget ID that this Option belongs to */
    widgetId: number;
    /** The option type, either attrib or raw */
    type: string;
    /** The option name */
    option: string;
    /** The option value */
    value: string;
}