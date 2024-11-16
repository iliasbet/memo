import mongoose from 'mongoose';

const memoSchema = new mongoose.Schema({
    sections: [{
        type: {
            type: String,
            required: true
        },
        contenu: {
            type: String,
            required: true
        },
        couleur: {
            type: String,
            required: true
        }
    }],
    metadata: {
        createdAt: {
            type: String,
            required: true
        },
        topic: {
            type: String,
            required: true
        }
    }
});

const collectionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    color: String,
    userId: {
        type: String,
        required: true
    },
    memos: [memoSchema],
    folderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Folder'
    }
}, {
    timestamps: true
});

const folderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

export const Collection = mongoose.models.Collection || mongoose.model('Collection', collectionSchema);
export const Folder = mongoose.models.Folder || mongoose.model('Folder', folderSchema); 