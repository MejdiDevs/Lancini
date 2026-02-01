/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import { CVData } from '@/types/cv';

// Font.register({ ... }); // Removed to use standard fonts

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 30,
        fontFamily: 'Helvetica',
    },
    header: {
        marginBottom: 20,
        borderBottomWidth: 2,
        borderBottomColor: '#2563EB',
        paddingBottom: 10,
    },
    name: {
        fontSize: 24,
        fontWeight: 700,
        color: '#111827',
        marginBottom: 4,
    },
    contactRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 8,
    },
    contactItem: {
        fontSize: 10,
        color: '#4B5563',
    },
    summary: {
        fontSize: 11,
        color: '#374151',
        lineHeight: 1.5,
    },
    section: {
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 700,
        color: '#2563EB',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    entry: {
        marginBottom: 8,
    },
    entryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 2,
    },
    entryTitle: {
        fontSize: 12,
        fontWeight: 700,
        color: '#1F2937',
    },
    entrySubtitle: {
        fontSize: 11,
        color: '#1F2937',
        // fontStyle: 'italic', // Removed to avoid font resolution error
    },
    entryDate: {
        fontSize: 10,
        color: '#6B7280',
        textAlign: 'right',
    },
    entryDescription: {
        fontSize: 10,
        color: '#4B5563',
        lineHeight: 1.4,
        marginTop: 2,
    },
    skillRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    skillBadge: {
        backgroundColor: '#F3F4F6',
        paddingVertical: 2,
        paddingHorizontal: 6,
        borderRadius: 4,
        fontSize: 10,
        color: '#374151',
    },
});

interface CVPdfProps {
    data: CVData;
}

export const CVPdf: React.FC<CVPdfProps> = ({ data }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.name}>{data.personal.fullName || 'Your Name'}</Text>
                <View style={styles.contactRow}>
                    {data.personal.email && <Text style={styles.contactItem}>{data.personal.email}</Text>}
                    {data.personal.phone && <Text style={styles.contactItem}>• {data.personal.phone}</Text>}
                    {data.personal.location && <Text style={styles.contactItem}>• {data.personal.location}</Text>}
                    {data.personal.linkedin && <Text style={styles.contactItem}>• {data.personal.linkedin}</Text>}
                    {data.personal.website && <Text style={styles.contactItem}>• {data.personal.website}</Text>}
                </View>
                {data.personal.summary && <Text style={styles.summary}>{data.personal.summary}</Text>}
            </View>

            {/* Experience */}
            {data.experience.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Experience</Text>
                    {data.experience.map((exp, index) => (
                        <View key={index} style={styles.entry}>
                            <View style={styles.entryHeader}>
                                <Text style={styles.entryTitle}>{exp.position}</Text>
                                <Text style={styles.entryDate}>{exp.startDate} - {exp.endDate}</Text>
                            </View>
                            <Text style={styles.entrySubtitle}>{exp.company}</Text>
                            <Text style={styles.entryDescription}>{exp.description}</Text>
                        </View>
                    ))}
                </View>
            )}

            {/* Education */}
            {data.education.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Education</Text>
                    {data.education.map((edu, index) => (
                        <View key={index} style={styles.entry}>
                            <View style={styles.entryHeader}>
                                <Text style={styles.entryTitle}>{edu.school}</Text>
                                <Text style={styles.entryDate}>{edu.startDate} - {edu.endDate}</Text>
                            </View>
                            <Text style={styles.entrySubtitle}>{edu.degree}</Text>
                            {edu.description && <Text style={styles.entryDescription}>{edu.description}</Text>}
                        </View>
                    ))}
                </View>
            )}

            {/* Projects */}
            {data.projects.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Projects</Text>
                    {data.projects.map((proj, index) => (
                        <View key={index} style={styles.entry}>
                            <Text style={styles.entryTitle}>{proj.title}</Text>
                            <Text style={styles.entryDescription}>{proj.description}</Text>
                            {proj.technologies.length > 0 && (
                                <Text style={[styles.entryDescription, { color: '#2563EB' }]}>
                                    Tech: {proj.technologies.join(', ')}
                                </Text>
                            )}
                        </View>
                    ))}
                </View>
            )}

            {/* Skills */}
            {data.skills.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Skills</Text>
                    <View style={styles.skillRow}>
                        {data.skills.map((skill, index) => (
                            <Text key={index} style={styles.skillBadge}>{skill.name}</Text>
                        ))}
                    </View>
                </View>
            )}
        </Page>
    </Document>
);
