import React, { useState, useRef } from 'react';
import { PROPERTIES } from '../data/properties';
import { Send, Phone, MessageSquare, Mic, MicOff, CheckCircle2, ShieldCheck, MapPin, Building2, Loader2, Sparkles, AlertCircle } from 'lucide-react';

interface ContactEnquirySectionProps {
  preselectedPropertyTitle?: string;
}

export const ContactEnquirySection: React.FC<ContactEnquirySectionProps> = ({
  preselectedPropertyTitle = '',
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [serviceType, setServiceType] = useState('Buying a Home in Houston / Katy');
  const [targetArea, setTargetArea] = useState('Katy & Cinco Ranch');
  const [message, setMessage] = useState('');
  const [needsStagingAdvice, setNeedsStagingAdvice] = useState(false);
  const [preferredLanguage, setPreferredLanguage] = useState<'English' | 'Russian'>('English');

  // Audio recording state for gemini-3.5-transcribe
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcribeNotice, setTranscribeNotice] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Form submission state
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Audio recording handlers
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await handleSendAudioForTranscription(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setTranscribeNotice('Recording audio... Speak your real estate or home criteria.');
    } catch (err: any) {
      console.error('Audio access error:', err);
      setTranscribeNotice('Microphone access was denied or is not supported in this browser.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSendAudioForTranscription = async (blob: Blob) => {
    setIsTranscribing(true);
    setTranscribeNotice('Transcribing with Gemini 3.5 Transcribe...');

    try {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64Audio = reader.result as string;

        const res = await fetch('/api/transcribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            audioBase64: base64Audio,
            mimeType: 'audio/webm',
          }),
        });

        const data = await res.json();
        if (data.transcription) {
          setMessage((prev) => (prev ? `${prev} ${data.transcription}` : data.transcription));
          setTranscribeNotice('Speech transcribed successfully into your message.');
        } else {
          setTranscribeNotice('Could not transcribe audio. Please try speaking clearly.');
        }
        setIsTranscribing(false);
      };
    } catch (err) {
      console.error('Transcription call failed:', err);
      setIsTranscribing(false);
      setTranscribeNotice('Transcription service unavailable.');
    }
  };

  // WhatsApp Enquiry Link Handler
  const handleWhatsAppEnquiry = () => {
    const text = encodeURIComponent(
      `Hello Marina,\n\nI am reaching out regarding Houston/Katy real estate:\n• Inquiry: ${serviceType}\n• Name: ${fullName || 'Prospective Client'}\n• Target Area: ${targetArea}\n• Staging Guidance: ${needsStagingAdvice ? 'Yes' : 'No'}\n• Message: ${message || 'I would like to discuss real estate opportunities in the area.'}`
    );
    window.open(`https://wa.me/18320000000?text=${text}`, '_blank');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <section id="contact" className="relative py-28 px-6 lg:px-16 bg-[#040914] border-b border-[#00F0FF]/20">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Direct Agent & Brokerage Details */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0B172E] border border-[#00F0FF]/40 rounded-xs mb-3 shadow-[0_0_15px_rgba(0,240,255,0.15)]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#00F0FF]" />
                <span className="text-[10px] tracking-[0.25em] text-[#00F0FF] uppercase font-semibold">
                  Direct Agent Contact
                </span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-serif-luxury text-[#F0F6FC] tracking-tight">
                CONNECT WITH <br />
                <span className="cyan-gradient-text italic font-editorial">MARINA ART</span>
              </h2>
              <p className="mt-4 text-[#CBD5E1] font-editorial text-lg leading-relaxed">
                Reach out for personalized buyer representation, seller marketing, design staging advice, or community inquiries across Houston and Katy, Texas.
              </p>
            </div>

            {/* Verified Brokerage & Agent Cards */}
            <div className="space-y-4">
              <div className="p-5 bg-[#0B172E] border border-[#00F0FF]/30 rounded-xs shadow-[0_0_20px_rgba(0,240,255,0.1)] space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xs bg-[#060D1E] border border-[#00F0FF]/40 flex items-center justify-center text-[#00F0FF]">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-serif-luxury text-[#F0F6FC]">
                      Premier Haus Realty, LLC
                    </h4>
                    <p className="text-xs text-[#CBD5E1]">
                      Licensed Texas Real Estate Brokerage
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#00F0FF]/15 space-y-1.5 text-xs text-[#CBD5E1]">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#00F0FF]" />
                    <span>Serving Katy, Cinco Ranch, Memorial & Greater Houston, TX</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#00F0FF]" />
                    <span>Bilingual Communication: English & Russian</span>
                  </div>
                </div>
              </div>

              {/* WhatsApp Quick Connect */}
              <div
                onClick={handleWhatsAppEnquiry}
                className="p-5 bg-[#0B172E] border border-[#00F0FF]/30 hover:border-[#00F0FF] rounded-xs cursor-pointer transition-all duration-300 shadow-xl group flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xs bg-[#060D1E] border border-[#00F0FF]/40 flex items-center justify-center text-[#25D366] group-hover:scale-105 transition-transform">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-serif-luxury text-[#F0F6FC] group-hover:text-[#00F0FF] transition-colors">
                      WhatsApp Direct Message
                    </h4>
                    <p className="text-xs text-[#CBD5E1] mt-0.5">
                      Fast mobile inquiries & consultation booking
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono font-semibold text-[#00F0FF] group-hover:translate-x-1 transition-transform">
                  Message &rarr;
                </span>
              </div>
            </div>

            {/* Unofficial Demo Concept Notice */}
            <div className="p-4 bg-[#0B172E]/90 border border-[#00F0FF]/30 rounded-xs text-xs text-[#CBD5E1] space-y-1.5 shadow-[0_0_15px_rgba(0,240,255,0.1)]">
              <div className="flex items-center gap-2 text-[#00F0FF] font-semibold tracking-wider uppercase">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Client Demo Presentation</span>
              </div>
              <p className="font-light leading-relaxed text-[#CBD5E1]">
                This website is an unofficial design concept developed to showcase digital presentation capabilities for Marina Art. No automated publishing or public MLS transactions take place here.
              </p>
            </div>
          </div>

          {/* Right Column: Working Contact & Voice-Enabled Enquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-[#0B172E]/90 border border-[#00F0FF]/40 p-8 sm:p-10 rounded-xs shadow-[0_0_35px_rgba(0,240,255,0.15)] relative backdrop-blur-md">
              {isSubmitted ? (
                <div className="text-center py-16 space-y-6">
                  <div className="w-16 h-16 rounded-full bg-[#060D1E] border-2 border-[#00F0FF] flex items-center justify-center mx-auto text-[#00F0FF] shadow-[0_0_20px_rgba(0,240,255,0.4)]">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-serif-luxury text-[#F0F6FC]">
                    Inquiry Transmitted
                  </h3>
                  <p className="text-sm text-[#CBD5E1] font-editorial max-w-md mx-auto leading-relaxed">
                    Thank you, <strong className="text-[#00F0FF]">{fullName || 'Valued Client'}</strong>. Your real estate inquiry regarding <strong className="text-[#00F0FF]">{targetArea}</strong> has been received for Marina Art.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="px-6 py-2.5 bg-[#060D1E] border border-[#00F0FF]/40 text-[#00F0FF] hover:bg-[#00F0FF] hover:text-[#040914] text-xs uppercase tracking-widest rounded-xs cursor-pointer transition-all"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="flex items-center justify-between border-b border-[#00F0FF]/20 pb-4">
                    <h3 className="text-xl font-serif-luxury text-[#F0F6FC]">
                      Real Estate Consultation Request
                    </h3>
                    <span className="text-[10px] tracking-widest text-[#00F0FF] uppercase font-mono font-semibold">
                      Houston & Katy, TX
                    </span>
                  </div>

                  {/* Inquiry Type & Target Area */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] uppercase tracking-widest text-[#00F0FF] font-semibold block mb-2">
                        I am interested in:
                      </label>
                      <select
                        value={serviceType}
                        onChange={(e) => setServiceType(e.target.value)}
                        className="w-full px-4 py-3 bg-[#060D1E] border border-[#00F0FF]/30 text-[#F0F6FC] rounded-xs text-xs focus:outline-none focus:border-[#00F0FF] cursor-pointer"
                      >
                        <option value="Buying a Home in Houston / Katy">Buying a Home in Houston / Katy</option>
                        <option value="Selling a Home & Design Staging">Selling a Home & Staging Guidance</option>
                        <option value="Comparative Market Analysis (CMA)">Free Comparative Market Analysis (CMA)</option>
                        <option value="Relocation to Greater Houston">Relocation to Greater Houston / Katy</option>
                        <option value="Residential Lease Inquiry">Residential Lease Inquiry</option>
                        <option value="Demo Website Concept Feedback">Website Concept Feedback</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] uppercase tracking-widest text-[#00F0FF] font-semibold block mb-2">
                        Target Community / Area:
                      </label>
                      <select
                        value={targetArea}
                        onChange={(e) => setTargetArea(e.target.value)}
                        className="w-full px-4 py-3 bg-[#060D1E] border border-[#00F0FF]/30 text-[#F0F6FC] rounded-xs text-xs focus:outline-none focus:border-[#00F0FF] cursor-pointer"
                      >
                        <option value="Katy & Cinco Ranch">Katy & Cinco Ranch (Katy ISD)</option>
                        <option value="Memorial Villages">Memorial Villages / Spring Branch</option>
                        <option value="River Oaks">River Oaks / Inner Loop</option>
                        <option value="The Heights">The Heights / Washington Corridor</option>
                        <option value="Energy Corridor">Energy Corridor / West Houston</option>
                        <option value="Sugar Land">Sugar Land / Fort Bend</option>
                        <option value="General Greater Houston">General Greater Houston Area</option>
                      </select>
                    </div>
                  </div>

                  {/* Name and Contact Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] uppercase tracking-widest text-[#00F0FF] font-semibold block mb-2">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Sarah Jenkins"
                        className="w-full px-4 py-3 bg-[#060D1E] border border-[#00F0FF]/30 text-[#F0F6FC] rounded-xs text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#00F0FF]"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] uppercase tracking-widest text-[#00F0FF] font-semibold block mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="(713) 000-0000"
                        className="w-full px-4 py-3 bg-[#060D1E] border border-[#00F0FF]/30 text-[#F0F6FC] rounded-xs text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#00F0FF]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] uppercase tracking-widest text-[#00F0FF] font-semibold block mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full px-4 py-3 bg-[#060D1E] border border-[#00F0FF]/30 text-[#F0F6FC] rounded-xs text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#00F0FF]"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] uppercase tracking-widest text-[#00F0FF] font-semibold block mb-2">
                        Preferred Language
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {(['English', 'Russian'] as const).map((lang) => (
                          <button
                            key={lang}
                            type="button"
                            onClick={() => setPreferredLanguage(lang)}
                            className={`py-2 text-xs font-medium rounded-xs border transition-all cursor-pointer ${
                              preferredLanguage === lang
                                ? 'bg-[#00F0FF] text-[#040914] border-[#00F0FF] font-bold shadow-[0_0_10px_rgba(0,240,255,0.4)]'
                                : 'bg-[#060D1E] text-[#F0F6FC] border-[#00F0FF]/30 hover:border-[#00F0FF]'
                            }`}
                          >
                            {lang}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Message with Microphone Voice Recording (gemini-3.5-transcribe) */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-[11px] uppercase tracking-widest text-[#00F0FF] font-semibold block">
                        Message & Property Criteria
                      </label>

                      {/* Microphone Voice Note Button */}
                      <button
                        type="button"
                        onClick={isRecording ? stopRecording : startRecording}
                        className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] rounded-xs border transition-all cursor-pointer ${
                          isRecording
                            ? 'bg-red-950 border-red-500 text-red-200 animate-pulse'
                            : 'bg-[#060D1E] border-[#00F0FF]/40 text-[#70F3FF] hover:border-[#00F0FF]'
                        }`}
                      >
                        {isRecording ? (
                          <>
                            <MicOff className="w-3.5 h-3.5 text-red-400" />
                            <span>Stop Voice Note</span>
                          </>
                        ) : (
                          <>
                            <Mic className="w-3.5 h-3.5 text-[#00F0FF]" />
                            <span>Speak Criteria</span>
                          </>
                        )}
                      </button>
                    </div>

                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell Marina about your timeline, preferred school districts, lot size, or staging questions..."
                      className="w-full px-4 py-3 bg-[#060D1E] border border-[#00F0FF]/30 text-[#F0F6FC] rounded-xs text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#00F0FF] leading-relaxed resize-none"
                    />

                    {transcribeNotice && (
                      <p className="mt-1 text-[11px] text-[#70F3FF] flex items-center gap-1.5">
                        {isTranscribing && <Loader2 className="w-3 h-3 animate-spin text-[#00F0FF]" />}
                        <span>{transcribeNotice}</span>
                      </p>
                    )}
                  </div>

                  {/* Checkbox for Staging Advice */}
                  <div className="pt-1">
                    <label className="flex items-center gap-2.5 text-xs text-[#CBD5E1] cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={needsStagingAdvice}
                        onChange={(e) => setNeedsStagingAdvice(e.target.checked)}
                        className="rounded-xs accent-[#00F0FF] cursor-pointer"
                      />
                      <span>I am interested in interior design and staging guidance for my property</span>
                    </label>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
                    <button
                      type="submit"
                      className="w-full sm:flex-1 py-3.5 bg-[#00F0FF] hover:bg-[#38BDF8] text-[#040914] font-serif-luxury font-bold text-xs tracking-[0.2em] uppercase rounded-xs transition-all shadow-[0_0_25px_rgba(0,240,255,0.35)] hover:shadow-[0_0_30px_rgba(0,240,255,0.5)] flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>Send Message to Marina</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleWhatsAppEnquiry}
                      className="w-full sm:w-auto py-3.5 px-5 bg-[#060D1E] hover:bg-[#102242] text-[#25D366] border border-[#25D366]/40 hover:border-[#25D366] text-xs font-semibold tracking-wider uppercase rounded-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4 text-[#25D366]" />
                      <span>WhatsApp Direct</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
