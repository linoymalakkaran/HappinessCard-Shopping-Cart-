
class File {
    lastModified: number;
    lastModifiedDate: Date;
    name: string;
    size: number;
    type: string;
}

class FileList {
    files: File[];
}

export default class FileInput {
    accept: string;
    autofocus: boolean;
    defaultValue: string;
    disabled: boolean;
    files: FileList;
    form: string;
    multiple: boolean;
    name: string;
    required: boolean;
    type: string;
    value: string;
};