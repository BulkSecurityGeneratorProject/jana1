package com.gsr.janasanth.service.impl;

import com.gsr.janasanth.service.ApekshaService;
import com.gsr.janasanth.service.FileService;
import com.gsr.janasanth.config.ApplicationProperties;
import com.gsr.janasanth.domain.Apeksha;
import com.gsr.janasanth.repository.ApekshaRepository;
import com.gsr.janasanth.repository.search.ApekshaSearchRepository;
import com.gsr.janasanth.service.dto.ApekshaDTO;
import com.gsr.janasanth.service.mapper.ApekshaMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import static org.elasticsearch.index.query.QueryBuilders.*;

import java.io.IOException;
import java.nio.charset.Charset;
import java.util.UUID;

/**
 * Service Implementation for managing Apeksha.
 */
@Service
@Transactional
public class ApekshaServiceImpl implements ApekshaService{

    private final Logger log = LoggerFactory.getLogger(ApekshaServiceImpl.class);

    private final ApekshaRepository apekshaRepository;

    private final ApekshaMapper apekshaMapper;

    private final ApekshaSearchRepository apekshaSearchRepository;
    
    private final FileService fileService;
    
    private final ApplicationProperties properties;

    public ApekshaServiceImpl(ApekshaRepository apekshaRepository, ApekshaMapper apekshaMapper, ApekshaSearchRepository apekshaSearchRepository, FileService fileService, ApplicationProperties properties) {
        this.apekshaRepository = apekshaRepository;
        this.apekshaMapper = apekshaMapper;
        this.apekshaSearchRepository = apekshaSearchRepository;
        this.fileService = fileService;
        this.properties = properties;
    }

    /**
     * Save a apeksha.
     *
     * @param apekshaDTO the entity to save
     * @return the persisted entity
     */
    @Override
    public ApekshaDTO save(ApekshaDTO apekshaDTO) {
        //log.debug("Request to save Apeksha : {}", apekshaDTO);
        Apeksha apeksha = apekshaMapper.toEntity(apekshaDTO);

        //STORING ALL FILE CONTENTS TO ANOTHER VARIABLE
        // THIS IS BEING DONE BECAUSE, WE DONT WANT TO STORE FILES IN DB. WE WANT TO STORE FILE IN FILESYSTEM
        // IN DB, WE JUST SAVE THE FILE NAME
        byte[] fileContent = apeksha.getAdditionalDocuments();
        //log.debug("file content = " + fileContent.length);

       /* byte[] additionalDocuments = apeksha.getAdditionalDocuments();
        byte[] photo = apeksha.getPhoto();
        byte[] applicationForm = apeksha.getApplicationForm();
        byte[] aadharCard = apeksha.getAadharCard();
        byte[] rationCard = apeksha.getRationCard();
        byte[] doctorReport = apeksha.getDoctorReport();
        byte[] bankPassbookFrontPage = apeksha.getBankPassbookFrontPage();
        byte[] nomineePhoto = apeksha.getNomineePhoto();
        byte[] nomineeAadharCardRationCard = apeksha.getNomineeAadharCardRationCard();
        byte[] nomineeRelationShipProof = apeksha.getNomineeRelationShipProof();
        byte[] nomineeBankPassbookFrontPage = apeksha.getNomineeBankPassbookFrontPage();*/


        apeksha.setAdditionalDocuments(null);
        
        /*apeksha.setPhoto(null);
        apeksha.setApplicationForm(null);
        apeksha.setAadharCard(null);
        apeksha.setRationCard(null);
        apeksha.setDoctorReport(null);
        apeksha.setBankPassbookFrontPage(null);
        apeksha.setNomineePhoto(null);
        apeksha.setNomineeAadharCardRationCard(null);
        apeksha.setNomineeRelationShipProof(null);
        apeksha.setNomineeBankPassbookFrontPage(null);*/

        apeksha = apekshaRepository.save(apeksha);
        String fileName = UUID.randomUUID().toString();
        try {
           // log.debug("file content = " + fileContent.length);
            fileService.saveBytestoDisk(fileContent, properties.getApeksha().getFileRoot() + apeksha.getId() + "/", fileName);
            //log.debug("file content = " + fileContent.length);
            /*fileService.saveBytestoDisk(additionalDocuments, properties.getApeksha().getFileRoot() + apeksha.getId() + "/", UUID.randomUUID().toString());
            fileService.saveBytestoDisk(photo, properties.getApeksha().getFileRoot() + apeksha.getId() + "/", UUID.randomUUID().toString());
            fileService.saveBytestoDisk(applicationForm, properties.getApeksha().getFileRoot() + apeksha.getId() + "/", UUID.randomUUID().toString());
            fileService.saveBytestoDisk(aadharCard, properties.getApeksha().getFileRoot() + apeksha.getId() + "/", UUID.randomUUID().toString());
            fileService.saveBytestoDisk(rationCard, properties.getApeksha().getFileRoot() + apeksha.getId() + "/", UUID.randomUUID().toString());
            fileService.saveBytestoDisk(doctorReport, properties.getApeksha().getFileRoot() + apeksha.getId() + "/", UUID.randomUUID().toString());
            fileService.saveBytestoDisk(bankPassbookFrontPage, properties.getApeksha().getFileRoot() + apeksha.getId() + "/", UUID.randomUUID().toString());
            fileService.saveBytestoDisk(nomineePhoto, properties.getApeksha().getFileRoot() + apeksha.getId() + "/", UUID.randomUUID().toString());
            fileService.saveBytestoDisk(nomineeAadharCardRationCard, properties.getApeksha().getFileRoot() + apeksha.getId() + "/", UUID.randomUUID().toString());
            fileService.saveBytestoDisk(nomineeRelationShipProof, properties.getApeksha().getFileRoot() + apeksha.getId() + "/", UUID.randomUUID().toString());
            fileService.saveBytestoDisk(nomineeBankPassbookFrontPage, properties.getApeksha().getFileRoot() + apeksha.getId() + "/", UUID.randomUUID().toString());
*/

		} catch (IOException e) {
			// TODO Auto-generated catch block
            e.printStackTrace();
            log.error("error", "an expcetion orruced while saiving", e);
		}
        createApplicationNumber(apeksha);
        apeksha.additionalDocuments(fileName.getBytes(Charset.forName("UTF-8")));
        apeksha = apekshaRepository.save(apeksha);
       // ApekshaDTO result = apekshaMapper.toDto(apeksha);
       ApekshaDTO result = toDto(apeksha);
        apekshaSearchRepository.save(apeksha);
        return result;
    }

    private void createApplicationNumber(Apeksha apeksha) {
        
        String formattedWithLeadingZeros = String.format("%08d", apeksha.getId());
        String yearOfApplication = String.valueOf(apeksha.getDateOfApplcation().getYear());
        String districtOfApplicant = apeksha.getDistrict();

    	String applicationNumber = formattedWithLeadingZeros + "/" + yearOfApplication + "/" + districtOfApplicant;
    	apeksha.setApplicationNumber(applicationNumber);
	}

	/**
     *  Get all the apekshas.
     *
     *  @param pageable the pagination information
     *  @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public Page<ApekshaDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Apekshas");
        return apekshaRepository.findAll(pageable)
        		.map(a -> toDto(a));
            //.map(apekshaMapper::toDto);
    }

    private ApekshaDTO toDto(Apeksha apeksha) {
    	
    	ApekshaDTO dto = apekshaMapper.toDto(apeksha);
    	if(null != dto.getAdditionalDocuments() && dto.getAdditionalDocuments().length > 0){
    		String fileName = new String(dto.getAdditionalDocuments(), Charset.forName("UTF-8"));
    		try {
                dto.setAdditionalDocuments(fileService.readBytesFromDisk(properties.getApeksha().getFileRoot() + apeksha.getId() + "/", fileName));
               // log.debug("READIING", "ADD DOC"+ dto.getAdditionalDocuments());
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
    	}
		return dto;
	}

	/**
     *  Get one apeksha by id.
     *
     *  @param id the id of the entity
     *  @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public ApekshaDTO findOne(Long id) {
        log.debug("Request to get Apeksha : {}", id);
        Apeksha apeksha = apekshaRepository.findOne(id);
        return toDto(apeksha);
    }

    /**
     *  Delete the  apeksha by id.
     *
     *  @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Apeksha : {}", id);
        apekshaRepository.delete(id);
        apekshaSearchRepository.delete(id);
    }

    /**
     * Search for the apeksha corresponding to the query.
     *
     *  @param query the query of the search
     *  @param pageable the pagination information
     *  @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public Page<ApekshaDTO> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of Apekshas for query {}", query);
        Page<Apeksha> result = apekshaSearchRepository.search(queryStringQuery(query), pageable);
        return result.map(a -> toDto(a));
    }
}
