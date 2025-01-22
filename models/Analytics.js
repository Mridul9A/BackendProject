const { Schema, model } = require('mongoose');

const analyticsSchema = new Schema({
  shortUrlId: { type: Schema.Types.ObjectId, ref: 'ShortURL', required: true },
  clicks: [{
    timestamp: { type: Date, default: Date.now },
    userAgent: { type: String },
    ipAddress: { type: String },
    location: { type: String },
  }],
}, { timestamps: true });

module.exports = model('Analytics', analyticsSchema);
