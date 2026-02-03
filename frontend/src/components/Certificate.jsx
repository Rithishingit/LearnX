import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, Share2, Award, CheckCircle, Calendar, Hash } from 'lucide-react';
import html2canvas from 'html2canvas';

const Certificate = ({ 
    studentName, 
    courseName, 
    instructorName = "LearnX Academy",
    completionDate,
    certificateId,
    grade = "A",
    hoursCompleted = 10
}) => {
    const certificateRef = useRef(null);

    const downloadCertificate = async () => {
        if (certificateRef.current) {
            const canvas = await html2canvas(certificateRef.current, {
                scale: 2,
                backgroundColor: null,
            });
            const link = document.createElement('a');
            link.download = `LearnX-Certificate-${certificateId}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        }
    };

    const shareCertificate = () => {
        const shareUrl = `${window.location.origin}/verify/${certificateId}`;
        if (navigator.share) {
            navigator.share({
                title: `${studentName}'s Certificate - ${courseName}`,
                text: `I just completed ${courseName} on LearnX!`,
                url: shareUrl,
            });
        } else {
            navigator.clipboard.writeText(shareUrl);
            alert('Certificate link copied to clipboard!');
        }
    };

    const formattedDate = new Date(completionDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="p-8">
            {/* Action Buttons */}
            <div className="flex justify-center gap-4 mb-8">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={downloadCertificate}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                    <Download className="w-5 h-5" />
                    Download Certificate
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={shareCertificate}
                    className="flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 border-2 border-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition-all"
                >
                    <Share2 className="w-5 h-5" />
                    Share on LinkedIn
                </motion.button>
            </div>

            {/* Certificate */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                ref={certificateRef}
                className="relative max-w-4xl mx-auto aspect-[1.414/1] bg-gradient-to-br from-slate-50 via-white to-slate-50 rounded-2xl shadow-2xl overflow-hidden"
                style={{ fontFamily: 'Georgia, serif' }}
            >
                {/* Decorative Border */}
                <div className="absolute inset-4 border-4 border-double border-amber-400/60 rounded-xl pointer-events-none" />
                <div className="absolute inset-6 border border-amber-300/40 rounded-lg pointer-events-none" />

                {/* Corner Ornaments */}
                <div className="absolute top-8 left-8 w-20 h-20">
                    <svg viewBox="0 0 100 100" className="w-full h-full text-amber-400/50">
                        <path d="M0,50 Q0,0 50,0 L50,10 Q10,10 10,50 Z" fill="currentColor"/>
                        <path d="M20,0 L20,20 L0,20" fill="none" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                </div>
                <div className="absolute top-8 right-8 w-20 h-20 rotate-90">
                    <svg viewBox="0 0 100 100" className="w-full h-full text-amber-400/50">
                        <path d="M0,50 Q0,0 50,0 L50,10 Q10,10 10,50 Z" fill="currentColor"/>
                        <path d="M20,0 L20,20 L0,20" fill="none" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                </div>
                <div className="absolute bottom-8 left-8 w-20 h-20 -rotate-90">
                    <svg viewBox="0 0 100 100" className="w-full h-full text-amber-400/50">
                        <path d="M0,50 Q0,0 50,0 L50,10 Q10,10 10,50 Z" fill="currentColor"/>
                        <path d="M20,0 L20,20 L0,20" fill="none" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                </div>
                <div className="absolute bottom-8 right-8 w-20 h-20 rotate-180">
                    <svg viewBox="0 0 100 100" className="w-full h-full text-amber-400/50">
                        <path d="M0,50 Q0,0 50,0 L50,10 Q10,10 10,50 Z" fill="currentColor"/>
                        <path d="M20,0 L20,20 L0,20" fill="none" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                </div>

                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }} />
                </div>

                {/* Content */}
                <div className="relative h-full flex flex-col items-center justify-center p-12 text-center">
                    {/* Logo & Header */}
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2 rounded-lg">
                            <Award className="w-8 h-8 text-white" />
                        </div>
                        <span className="text-3xl font-bold">
                            <span className="text-indigo-600">Learn</span>
                            <span className="text-gray-900">X</span>
                        </span>
                    </div>
                    
                    <p className="text-amber-600 font-semibold tracking-[0.3em] uppercase text-sm mb-8">
                        Certificate of Completion
                    </p>

                    {/* Decorative Line */}
                    <div className="flex items-center gap-4 mb-6 w-full max-w-md">
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
                        <div className="w-2 h-2 bg-amber-400 rotate-45" />
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
                    </div>

                    <p className="text-gray-600 text-lg mb-2">This is to certify that</p>

                    <h1 className="text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Brush Script MT, cursive' }}>
                        {studentName}
                    </h1>

                    <p className="text-gray-600 text-lg mb-2">has successfully completed the course</p>

                    <h2 className="text-2xl font-bold text-indigo-700 mb-6 max-w-lg">
                        "{courseName}"
                    </h2>

                    <div className="flex items-center justify-center gap-8 mb-8 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-4 h-4 text-indigo-500" />
                            <span>{formattedDate}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>Grade: {grade}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                            <Award className="w-4 h-4 text-amber-500" />
                            <span>{hoursCompleted} Hours</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 mb-8 w-full max-w-md">
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
                        <div className="w-2 h-2 bg-amber-400 rotate-45" />
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
                    </div>

                    <div className="flex justify-between items-end w-full max-w-lg">
                        <div className="text-center">
                            <div className="w-40 border-b-2 border-gray-400 mb-2" />
                            <p className="text-sm text-gray-600 font-semibold">{instructorName}</p>
                            <p className="text-xs text-gray-500">Instructor</p>
                        </div>
                        <div className="text-center">
                            <div className="w-32 h-12 flex items-center justify-center">
                                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-lg">
                                    <Award className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Official Seal</p>
                        </div>
                        <div className="text-center">
                            <div className="w-40 border-b-2 border-gray-400 mb-2" />
                            <p className="text-sm text-gray-600 font-semibold">LearnX Academy</p>
                            <p className="text-xs text-gray-500">Platform</p>
                        </div>
                    </div>

                    {/* Certificate ID */}
                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-2 text-xs text-gray-400">
                        <Hash className="w-3 h-3" />
                        <span>Certificate ID: {certificateId}</span>
                    </div>
                </div>

                {/* Holographic Effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-50 pointer-events-none" />
            </motion.div>
        </div>
    );
};

export default Certificate;
