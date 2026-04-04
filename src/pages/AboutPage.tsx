import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import ScrollReveal from '@/components/ScrollReveal';
import { BRAND, IMAGES } from '@/lib/constants';
import { Target, Eye, Award, Users, Building2, Globe, ArrowRight, CheckCircle2 } from 'lucide-react';
import { teamAPI, getImageUrl } from '@/lib/api';
import type { TeamMember } from '@/lib/types';

const AboutPage: React.FC = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const data = await teamAPI.getAll();
        setTeam(data);
      } catch (error) {
        console.error('Failed to fetch team:', error);
      }
      setLoading(false);
    };
    fetchTeam();
  }, []);

  const milestones = [
  { year: '2010', title: 'Company Founded', desc: 'Nickztech Construction was established in Douala, Cameroon.' },
  { year: '2013', title: 'First Major Project', desc: 'Completed our first commercial building project in Douala.' },
  { year: '2016', title: 'Regional Expansion', desc: 'Expanded operations to Yaoundé and other major cities.' },
  { year: '2019', title: 'International Growth', desc: 'Began projects in neighboring countries.' },
  { year: '2022', title: '150+ Projects', desc: 'Reached the milestone of 150 completed projects.' },
  { year: '2025', title: 'Industry Leader', desc: 'Recognized as one of Cameroon\'s top construction firms.' },
];

  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-24 bg-gradient-to-br from-[#1F2F8F] to-[#0D1B4A] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src={IMAGES.hero} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">About Us</h1>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto">Discover the story behind Cameroon's premier construction company and our commitment to building excellence.</p>
          <div className="flex items-center justify-center gap-2 mt-6 text-sm text-blue-300">
            <Link to="/" className="hover:text-[#F5A623]">Home</Link>
            <span>/</span>
            <span className="text-[#F5A623]">About Us</span>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal>
              <img src={IMAGES.team} alt="Our team" className="rounded-2xl shadow-xl w-full" />
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <span className="text-[#F5A623] font-semibold text-sm uppercase tracking-wider">Who We Are</span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1F2F8F] mt-2 mb-6">Building Dreams Into Reality Since 2010</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Nickztech Construction Co Ltd is a leading construction company headquartered in Douala, Cameroon. Founded with a vision to transform the construction landscape in Central Africa, we have grown from a small local contractor to a respected name in the industry, delivering projects across multiple countries.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                Our success is built on a foundation of integrity, quality craftsmanship, and an unwavering commitment to client satisfaction. Every project we undertake reflects our dedication to excellence and our passion for building structures that stand the test of time.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-[#F4F4F4] rounded-xl p-5">
                  <Target className="w-8 h-8 text-[#F5A623] mb-3" />
                  <h4 className="font-bold text-[#1F2F8F] mb-2">Our Mission</h4>
                  <p className="text-sm text-gray-600">To deliver exceptional construction services that exceed client expectations while maintaining the highest standards of safety and quality.</p>
                </div>
                <div className="bg-[#F4F4F4] rounded-xl p-5">
                  <Eye className="w-8 h-8 text-[#F5A623] mb-3" />
                  <h4 className="font-bold text-[#1F2F8F] mb-2">Our Vision</h4>
                  <p className="text-sm text-gray-600">To be the most trusted and innovative construction company in Africa, setting new standards for quality and sustainability.</p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gradient-to-r from-[#1F2F8F] to-[#2E3FBF]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Building2, value: '200+', label: 'Projects Completed' },
              { icon: Users, value: '150+', label: 'Happy Clients' },
              { icon: Award, value: '15+', label: 'Years Experience' },
              { icon: Globe, value: '5+', label: 'Countries' },
            ].map((stat, i) => (
              <ScrollReveal key={i} delay={i * 100} className="text-center text-white">
                <stat.icon className="w-10 h-10 text-[#F5A623] mx-auto mb-3" />
                <div className="text-3xl md:text-4xl font-bold">{stat.value}</div>
                <div className="text-blue-200 text-sm mt-1">{stat.label}</div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-[#F4F4F4]">
        <div className="max-w-4xl mx-auto px-4">
          <ScrollReveal className="text-center mb-14">
            <span className="text-[#F5A623] font-semibold text-sm uppercase tracking-wider">Our Journey</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1F2F8F] mt-2">Company Milestones</h2>
          </ScrollReveal>
          <div className="relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-[#1F2F8F]/20 md:-translate-x-0.5" />
            {milestones.map((m, i) => (
              <ScrollReveal key={i} delay={i * 100} className={`relative flex items-start gap-6 mb-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                <div className={`hidden md:block flex-1 ${i % 2 === 0 ? 'text-right' : 'text-left'}`}>
                  <div className="bg-white rounded-xl p-5 shadow-sm inline-block">
                    <div className="text-[#F5A623] font-bold text-lg">{m.year}</div>
                    <h4 className="font-bold text-[#1F2F8F] mt-1">{m.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{m.desc}</p>
                  </div>
                </div>
                <div className="absolute left-4 md:left-1/2 w-3 h-3 bg-[#F5A623] rounded-full -translate-x-1.5 md:-translate-x-1.5 mt-2 ring-4 ring-white" />
                <div className="md:hidden ml-10 bg-white rounded-xl p-5 shadow-sm flex-1">
                  <div className="text-[#F5A623] font-bold text-lg">{m.year}</div>
                  <h4 className="font-bold text-[#1F2F8F] mt-1">{m.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{m.desc}</p>
                </div>
                <div className="hidden md:block flex-1" />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal className="text-center mb-14">
            <span className="text-[#F5A623] font-semibold text-sm uppercase tracking-wider">Our Team</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1F2F8F] mt-2 mb-4">Meet Our Leadership</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Our experienced leadership team brings decades of combined expertise in construction, engineering, and project management.</p>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, i) => (
              <ScrollReveal key={member.id} delay={i * 100}>
                <div className="group text-center">
                  <div className="relative w-48 h-48 mx-auto mb-4 rounded-2xl overflow-hidden">
                    <img src={getImageUrl(member.image_url)} alt={member.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1F2F8F]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h4 className="font-bold text-[#1F2F8F] text-lg">{member.name}</h4>
                  <p className="text-[#F5A623] text-sm font-medium">{member.role}</p>
                  {member.bio && <p className="text-gray-600 text-sm mt-2">{member.bio}</p>}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-[#F4F4F4]">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal className="text-center mb-14">
            <span className="text-[#F5A623] font-semibold text-sm uppercase tracking-wider">Our Values</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1F2F8F] mt-2">What Drives Us</h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Quality Excellence', desc: 'We never compromise on quality. Every material, every technique, and every finish meets the highest international standards.', icon: Award },
              { title: 'Client First', desc: 'Your satisfaction is our priority. We listen, adapt, and deliver solutions that perfectly match your vision and requirements.', icon: Users },
              { title: 'Innovation', desc: 'We embrace modern construction technologies and methods to deliver projects that are efficient, sustainable, and future-ready.', icon: Target },
            ].map((value, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="bg-white rounded-xl p-8 text-center hover:shadow-xl transition-shadow h-full">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#1F2F8F] to-[#2E3FBF] rounded-xl flex items-center justify-center mx-auto mb-5">
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-bold text-[#1F2F8F] text-lg mb-3">{value.title}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{value.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AboutPage;
